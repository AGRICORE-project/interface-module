package eu.agricore.ardit.interfac.util;

import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.service.LdapUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Component
public class UserAccountService {


	@Autowired
	private LdapUserService ldapService;


	public Set<String> getUserRole(Set<String> role) {
		Set<String> result = new HashSet<>();
		if (role!=null && !role.isEmpty()) {
			if (role.size() == 1) {
				result = role;
			} else{
				Set<String> aux = new HashSet<>();
				if(role.contains("ADMIN")){
					aux.add("ADMIN");
					result = aux;
				}else if(role.contains("MANTAINER")){
					aux.add("MANTAINER");
					result = aux;
				}else if(role.contains("EDITOR")){
					aux.add("EDITOR");
					result = aux;
				}else{
					aux.add("USER");
					result = aux;
				}
			}
		}
		return result;
	}


	public LdapUser getCurrentLdapUser() throws ResponseStatusException {
		LdapUser ldapUser = null;
		Optional<LdapUser> optionalUser = getOptionalCurrentLdapUser();
		if(!optionalUser.isEmpty() && optionalUser.isPresent()) {
			ldapUser = optionalUser.get();
		}
		return ldapUser;
	}


	private Optional<LdapUser> getOptionalCurrentLdapUser() throws ResponseStatusException {
		Optional<LdapUser> optionalUser = Optional.empty();
		String username = getCurrentUsername();
		if(username!=null && !username.isEmpty() && !username.isBlank()){
			optionalUser = ldapService.find(username);	
		}
		return optionalUser;
	}

	private String getCurrentUsername() {

		UsernamePasswordAuthenticationToken auth = null;
		String principalLogged = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		String currentUsername = "";

		if(!principalLogged.equals("anonymousUser")){
			 auth = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
		}

		if(auth != null){
			currentUsername =  auth.getPrincipal().toString();
		}

		return currentUsername;
	}

}
