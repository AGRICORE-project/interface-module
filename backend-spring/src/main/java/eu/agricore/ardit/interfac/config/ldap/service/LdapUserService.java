package eu.agricore.ardit.interfac.config.ldap.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import eu.agricore.ardit.interfac.config.ldap.dto.AuthRequest;
import eu.agricore.ardit.interfac.config.ldap.dto.LdapUserDTO;
import eu.agricore.ardit.interfac.config.ldap.exception.UserAlreadyExistException;
import eu.agricore.ardit.interfac.config.ldap.model.LdapGroupDetails;
import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.repository.LdapUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ldap.NameAlreadyBoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LdapUserService {

    @Autowired
    private LdapUserRepository repository;


    public Boolean authenticate(LdapUser user) {
        return repository.authenticate(user);
    }

    public Boolean authenticate(AuthRequest authRequest) {
        return repository.authenticate(authRequest.getEmail(), authRequest.getPassword());
    }

    public Boolean authenticate(final String username, final String password) {
        return repository.authenticate(username, password);
    }

    public LdapUser create(LdapUser user) throws UserAlreadyExistException {
        LdapUser res;
        try {
            res = repository.create(user);
            res = addToGroup(res, "user");
        } catch (NameAlreadyBoundException e) {
            throw new UserAlreadyExistException("User already exists");
        }
        return res;
    }


    public List<LdapGroupDetails> getLdapGroupIdByName(String userGroupName){
        return repository.getLdapGroupIdByName(userGroupName);
    }


    public void deleteLdapUser(String username) {

        // Delete LDAP user
        repository.deleteByUsername(username);
        // Remove user entry of each group
        Set<String> roles = getRolesByUser(username);

        LdapUser ldapUser = new LdapUser();
        ldapUser.setRoles(roles);
        ldapUser.setFullName(username);

        for (String group : roles) {
            repository.deleteFromGroup(ldapUser, group);
        }

    }


    public void delete(LdapUser user) {

        // Delete LDAP user
        repository.delete(user);
        // Remove user entry of each group
        for (String group : user.getRoles()) {
            repository.deleteFromGroup(user, group);
        }


    }

    public Optional<LdapUser> find(final String username) {
        Optional<LdapUser> res = repository.find(username);
        return res;
    }

    public Set<String> getRolesByUser(final String username) {
        Set<String> res = repository.getRolesByUser(username);
        return res;
    }

    public Optional<LdapUser> update(LdapUser userLogged,LdapUserDTO userDTO) {
        Optional<LdapUser> res;
        LdapUser user = new LdapUser(userDTO.getFullName(), "", userDTO.getEmail());
        res = repository.update(userLogged,user);
        return res;
    }

    public Optional<LdapUser> updatePassword(final String username, final String password) {
        Optional<LdapUser> res = repository.updatePassword(username, password);
        return res;
    }

    private LdapUser addToGroup(LdapUser user, String group) {
        LdapUser res = repository.addToGroup(user, group);
        return res;
    }

    public LdapUser getCurrentLdapUser() throws ResponseStatusException {
        Optional<LdapUser> optionalUser = getOptionalCurrentLdapUser();
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found");
        }
        return optionalUser.get();
    }

    private Optional<LdapUser> getOptionalCurrentLdapUser() throws ResponseStatusException {
        String username = getCurrentUsername();
        Optional<LdapUser> optionalUser = find(username);
        return optionalUser;
    }


    private Boolean isCurrentUser(final String username) {
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getPrincipal().toString();
        return currentUsername.equals(username);
    }

    private String getCurrentUsername() {
        UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getPrincipal().toString();
        return currentUsername;
    }

}
