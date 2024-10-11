package eu.agricore.ardit.interfac.services;

import com.google.common.collect.Sets;
import eu.agricore.ardit.interfac.config.ldap.dto.LdapUserDTO;
import eu.agricore.ardit.interfac.config.ldap.exception.UserAlreadyExistException;
import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.model.UserDetails;
import eu.agricore.ardit.interfac.config.ldap.repository.LdapUserRepository;
import eu.agricore.ardit.interfac.model.AppUser;
import eu.agricore.ardit.interfac.util.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.NameAlreadyBoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserManagementService {

    @Autowired
    private LdapUserRepository repository;

    @Autowired
    private AppUserService appUserService;

    @Autowired
    private UserAccountService userAccountService;

    @Autowired
    private PolicyService policyService;

    public List<UserDetails> findAll() {
        List<UserDetails> result = new ArrayList<>();
        List<AppUser> appUsers = appUserService.findAll();
        List<LdapUser> ldapUsers = repository.findAll();
        result = buildListUserDetails(appUsers, ldapUsers);
        return result;
    }

    private List<UserDetails> buildListUserDetails(List<AppUser> appUsers, List<LdapUser> ldapUsers) {
        List<UserDetails> result = new ArrayList<>();
        for (AppUser appUser : appUsers) {
            for (LdapUser ldapUser : ldapUsers) {
                if (appUser.getEmail().equals(ldapUser.getEmail())) {
                    UserDetails userDetails = new UserDetails(appUser, ldapUser);
                    result.add(userDetails);
                }
            }

        }

        return result;
    }

    public Optional<LdapUser> find(final String username) {
        return repository.find(username);
    }

    private UserDetails buildListUserDetails(AppUser appUser, LdapUser ldapUser) {
        UserDetails result = new UserDetails(appUser, ldapUser);
		return result;
    }

    public Optional<UserDetails> findDetails(final String username) {
        Optional<UserDetails> result;
        AppUser appUser = appUserService.findAppUserByEmail(username);
        LdapUser ldapUsers = repository.find(username).get();
        result = Optional.of(buildListUserDetails(appUser, ldapUsers));
        return result;
    }

    public Set<String> getRolesByUser(final String username) {
        return repository.getRolesByUser(username);
    }

    public Set<String> getAllRoles() {
        return repository.getAllRoles();
    }

    public LdapUser create(LdapUser user) throws UserAlreadyExistException {

        LdapUser res; // Create LDAP user

        Set<String> desirableRoles = user.getRoles(); // Roles to be assigned to the user

        try {

            res = repository.create(user); // Create the user

            res.setRoles(new HashSet<String>()); // Clear the set of roles of the returned user to avoid errors when updating

            res = updateUserRoles(res, desirableRoles); // Assign the desirable roles

        } catch (NameAlreadyBoundException e) {
            throw new UserAlreadyExistException("User already exists");
        }

        // Create App user
        appUserService.createAppUser(user);

        return res;
    }

    public Optional<AppUser> updateApiUrl(String email,String apiUrl) {
        Optional<AppUser> result = Optional.empty();
        AppUser appUser = appUserService.findAppUserByEmail(email);
        appUser.setApiUrl(apiUrl);
        result = Optional.of(appUserService.save(appUser));
        return result;
    }


    public String userApiUrl(String email) {
        return appUserService.findAppUserByEmail(email).getApiUrl();
    }


    public Optional<LdapUser> update(LdapUser userLogged, LdapUserDTO userDTO) {

        Optional<LdapUser> result = Optional.empty();

        AppUser appUserUpdated = appUserService.updateAppUser(userLogged.getEmail(), userDTO);


        LdapUser user = new LdapUser(userDTO.getFullName(), "", userDTO.getEmail());
        Optional<LdapUser> userUpdated = repository.update(userLogged, user);

        if (userUpdated.isPresent() && !userUpdated.isEmpty()) {

            LdapUser response = new LdapUser();
            response.setCountry(appUserUpdated.getCountry());
            response.setRoles(userAccountService.getUserRole(userUpdated.get().getRoles()));
            response.setInstitution(appUserUpdated.getInstitution());
            response.setEmail(appUserUpdated.getEmail());
            response.setFullName(appUserUpdated.getFullName());
            result = Optional.of(response);

        }


        return result;
    }

    public LdapUser updateUserRoles(LdapUser user, Set<String> newRoles) {

        Set<String> allRoles = repository.getAllRoles();
        Set<String> userRoles = getRolesByUser(user.getEmail());

        //Role filtering: deletes invalid roles
        newRoles.retainAll(allRoles);

        //Add default role 'USER'
        newRoles.add(repository.getDefaultRoleName());

        //Get roles to remove from the user
        Set<String> rolesToRemove = Sets.newHashSet(userRoles);
        rolesToRemove.removeAll(newRoles);

        //Delete roles
        for (String role : rolesToRemove) {
            user = repository.deleteFromGroup(user, role);
        }

        //Add new roles
        for (String role : newRoles) {
            user = repository.addToGroup(user, role);
        }

        //Clear LdapUser instance roles
        user.setRoles(getRolesByUser(user.getEmail()));
        return user;

    }

    public Optional<LdapUser> updatePassword(final String username, final String password) {
        Optional<LdapUser> res = repository.updatePassword(username, password);
        return res;
    }

    public void delete(LdapUser user) {

        AppUser appUser = appUserService.findAppUserByEmail(user.getEmail());

        // Delete LDAP user
        repository.delete(user);
        // Remove user entry of each group
        for (String group : user.getRoles()) {
            repository.deleteFromGroup(user, group);
        }

        // Delete policies
        policyService.findByAppUserId(appUser.getId()).ifPresent(x -> x.stream().forEach(policy -> policyService.delete(policy.getId())));

        // Delete AppUser
        appUserService.removeAppUser(user.getEmail());
    }
}