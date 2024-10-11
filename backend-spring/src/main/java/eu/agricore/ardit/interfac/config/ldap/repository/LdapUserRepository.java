package eu.agricore.ardit.interfac.config.ldap.repository;

import com.google.common.collect.Sets;
import eu.agricore.ardit.interfac.config.ldap.model.LdapGroupAttributes;
import eu.agricore.ardit.interfac.config.ldap.model.LdapGroupDetails;
import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.util.PasswordEncoder;
import eu.agricore.ardit.interfac.config.ldap.exception.UserAlreadyExistException;
import eu.agricore.ardit.interfac.util.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.AuthenticationException;
import org.springframework.ldap.NameNotFoundException;
import org.springframework.ldap.core.*;
import org.springframework.ldap.query.LdapQuery;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Service;

import javax.naming.Name;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
@Transactional
public class LdapUserRepository {

    @Value("${ldap.partitionSuffix}")
    private String ldapPartitionSuffix;

    @Autowired
    private ContextSource contextSource;

    @Autowired
    private LdapTemplate ldapTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserAccountService userAccountService;

    public Boolean authenticate(LdapUser user) {
        return authenticate(user.getEmail(), user.getPassword());
    }

    public Boolean authenticate(final String username, final String password) {
        Boolean res = false;
        try {
            String partitionSuffix = ldapPartitionSuffix;
            String principal = "cn=" + username + ",ou=users," + partitionSuffix;
            contextSource.getContext(principal, password);
            res = true;
        } catch (AuthenticationException e) {
            res = false;
        }

        return res;
    }

    public LdapUser create(LdapUser user) throws UserAlreadyExistException {
        DirContextAdapter context = buildUser(user);
        ldapTemplate.bind(context);
        return user;
    }

    public void delete(LdapUser user) {
        delete(user.getEmail());
    }

    public void deleteByUsername(String username) {
        delete(username);
    }

    public void delete(String username) {
        Name dn = getUserDN(username);
        ldapTemplate.unbind(dn);
    }

    public Optional<LdapUser> find(final String username) {
        Optional<LdapUser> res;
        try {
            Name dn = getUserDN(username);
            LdapUser user = ldapTemplate.lookup(dn, new LdapUserAttributesMapper());
            user.setRoles(getRolesByUser(username));
            res = Optional.of(user);
        } catch (NameNotFoundException e) {
            res = Optional.empty();
        }

        return res;
    }

    public List<LdapUser> findAll() {

        List<LdapUser> res = ldapTemplate.search("", "(objectClass=posixAccount)", new LdapUserAttributesMapper());

        res = res.stream()
                .map(u -> u.setRoles(getRolesByUser(u.getEmail())))
                .collect(Collectors.toList());

        return res;
    }

    public Set<String> getRolesByUser(final String username) {
        LdapQuery query = query()
                .base("ou=groups")
                .attributes("cn")
                .where("objectClass").is("posixGroup")
                .and("memberUid").is(username);

        AttributesMapper<String> mapper = attrs -> attrs.get("cn").get().toString();

        List<String> rolesList = ldapTemplate.search(query, mapper);

        Set<String> res = rolesList.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        return res;
    }


    public List<LdapGroupDetails> getLdapGroupIdByName(final String userGroupName) {

        List<LdapGroupDetails> result = new ArrayList<>();

        LdapQuery query = query()
                .base("ou=groups")
                .where("objectClass").is("posixGroup")
                .and("cn").is(userGroupName);


        List<LdapGroupDetails> ldapGroupDetails = ldapTemplate.search(query, new LdapGroupAttributes());

        if (ldapGroupDetails != null) {
            result = ldapGroupDetails;
        }

        return result;
    }


    public Set<String> getAllRoles() {
        LdapQuery query = query()
                .base("ou=groups")
                .attributes("cn")
                .where("objectClass").is("posixGroup");

        AttributesMapper<String> mapper = attrs -> attrs.get("cn").get().toString();

        List<String> rolesList = ldapTemplate.search(query, mapper);

        Set<String> res = rolesList.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        return res;
    }

    public String getDefaultRoleName() {

        //TODO: store user roles in LDAP or in the application.properties file
        return "USER";
    }

    public Optional<LdapUser> update(LdapUser userLogged,LdapUser user) {

        Optional<LdapUser> res;



        try {

            Name oldDN = getUserDN(userLogged);
            Name newDN = getUserDN(user);


            DirContextAdapter context = (DirContextAdapter) ldapTemplate.lookup(oldDN);

            context.setAttributeValue("mail", user.getEmail());
            ldapTemplate.modifyAttributes(context);
            ldapTemplate.rename(oldDN,newDN);


            for (String rol : userLogged.getRoles()) {
                Name groupDN = getGroupDN(rol.toLowerCase());
                DirContextAdapter contextGroup = (DirContextAdapter) ldapTemplate.lookup(groupDN);

                String[] memberUid = contextGroup.getStringAttributes("memberUid");
                if (memberUid == null) {
                    memberUid = new String[0];
                }

                for (int i = 0; i < memberUid.length; i++) {
                    String element = memberUid[i];
                    if(element.equals(userLogged.getEmail())){
                        memberUid[i]= user.getEmail();
                    }
                }

                Set<String> memberUidList = Sets.newHashSet(memberUid);

                memberUidList.add(user.getEmail());

                contextGroup.setAttributeValues("memberUid", memberUidList.toArray());
                ldapTemplate.modifyAttributes(contextGroup);

            }


            res = find(user.getEmail());

        } catch (NameNotFoundException nameNotFoundException) {
            res = Optional.empty();
        }

        return res;
    }

    public Optional<LdapUser> updatePassword(final String username, final String password) {

        Optional<LdapUser> res;

        try {

            Name dn = getUserDN(username);

            DirContextOperations context = ldapTemplate.lookupContext(dn);

            context.setAttributeValue("userPassword", passwordEncoder.encondePassword(password));

            ldapTemplate.modifyAttributes(context);

            res = find(username);

        } catch (NameNotFoundException e) {
            res = Optional.empty();
        }

        return res;
    }

    public LdapUser addToGroup(LdapUser user, String group) {
        group = group.toLowerCase();
        Name dn = getGroupDN(group);

        DirContextOperations context = ldapTemplate.lookupContext(dn);

        String[] memberUid = context.getStringAttributes("memberUid");
        if (memberUid == null) {
            memberUid = new String[0];
        }
        Set<String> memberUidList = Sets.newHashSet(memberUid);

        memberUidList.add(user.getEmail());

        context.setAttributeValues("memberUid", memberUidList.toArray());
        ldapTemplate.modifyAttributes(context);

        Set<String> roles = user.getRoles();
        roles.add(group);
        user.setRoles(roles);

        return user;
    }

    public LdapUser deleteFromGroup(LdapUser user, String group) {
        group = group.toLowerCase();
        Name dn = getGroupDN(group);

        DirContextOperations context = ldapTemplate.lookupContext(dn);

        String[] memberUid = context.getStringAttributes("memberUid");
        if (memberUid == null) {
            memberUid = new String[0];
        }
        Set<String> memberUids = Sets.newHashSet(memberUid);

        Boolean removed = memberUids.remove(user.getEmail());

        if (removed) {
            context.setAttributeValues("memberUid", memberUids.toArray());
            ldapTemplate.modifyAttributes(context);

            Set<String> roles = user.getRoles();
            roles.remove(group);
            user.setRoles(roles);
        }

        return user;
    }

    private Name getUserDN(final String username) {
        return LdapNameBuilder
                .newInstance()
                .add("ou", "users")
                .add("cn", username)
                .build();
    }

    private Name getUserDN(LdapUser user) {
        return LdapNameBuilder
                .newInstance()
                .add("ou", "users")
                .add("cn", user.getEmail())
                .build();
    }

    private Name getGroupDN(final String group) {
        return LdapNameBuilder
                .newInstance()
                .add("ou", "groups")
                .add("cn", group)
                .build();
    }

    private DirContextAdapter buildUser(LdapUser user) {

        Name dn = LdapNameBuilder
                .newInstance()
                .add("ou", "users")
                .add("cn", user.getEmail())
                .build();
        DirContextAdapter context = new DirContextAdapter(dn);

        List<LdapGroupDetails> ldapGroupDetailsList = getLdapGroupIdByName("user");

        String homeDirectory = "/home/users/" + user.getFullName();
        String gidNumber = "";


        if(ldapGroupDetailsList!=null & !ldapGroupDetailsList.isEmpty()){
            LdapGroupDetails ldapGroupDetails = ldapGroupDetailsList.get(0);
            gidNumber = ldapGroupDetails.getGroupId().toString();
        }

        /* User creation */
        // TODO: Creation date?
        // TODO: Verified?

        context.setAttributeValues("objectclass", new String[]{"top", "posixAccount", "inetOrgPerson"});
        context.setAttributeValue("cn", user.getFullName());
        context.setAttributeValue("sn", user.getFullName());
        context.setAttributeValue("userPassword", passwordEncoder.encondePassword(user.getPassword()));
        context.setAttributeValue("uid", user.getEmail());
        context.setAttributeValue("uidNumber", new BigInteger(256, new Random()).toString());
        context.setAttributeValue("mail", user.getEmail());
        context.setAttributeValue("gidNumber", gidNumber);        // TODO: 501 is the user group, but must be recovered dynamically
        context.setAttributeValue("homeDirectory", homeDirectory);

        return context;
    }

    private class LdapUserAttributesMapper implements AttributesMapper<LdapUser> {
        @Override
        public LdapUser mapFromAttributes(Attributes attrs) throws NamingException {
            LdapUser user = new LdapUser();

            String username = attrs.get("cn").get().toString();
            String password = attrs.get("userpassword").get().toString();
            String email = attrs.get("mail").get().toString();

            user.setFullName(username)
                    .setPassword(password)
                    .setEmail(email);
            return user;
        }
    }


}

