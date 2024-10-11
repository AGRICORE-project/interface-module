package eu.agricore.ardit.interfac.controller.api;


import eu.agricore.ardit.interfac.config.ldap.dto.ApiUrlDTO;
import eu.agricore.ardit.interfac.config.ldap.dto.LdapUserDTO;
import eu.agricore.ardit.interfac.config.ldap.dto.RoleWrapper;
import eu.agricore.ardit.interfac.config.ldap.dto.UserCredentials;
import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.model.UserDetails;
import eu.agricore.ardit.interfac.config.ldap.service.LdapUserService;
import eu.agricore.ardit.interfac.config.ldap.util.Utils;
import eu.agricore.ardit.interfac.model.AppUser;
import eu.agricore.ardit.interfac.model.ConfirmationToken;
import eu.agricore.ardit.interfac.services.AppUserService;
import eu.agricore.ardit.interfac.services.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.*;

import java.util.stream.Collectors;

@ApiIgnore
@CrossOrigin(allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/users")
public class UserManagementController {
	
	@Autowired
	private UserManagementService userManagementService;
	@Autowired
	private LdapUserService ldapService;
	@Autowired
	private AppUserService appUserService;
	
	@GetMapping("")
	public ResponseEntity<Object> getAllUsers() {

		List<UserDetails> userList = userManagementService.findAll();
	   return ResponseEntity.ok()
        		.body(userList);
	}

	@GetMapping("/roles")
	public ResponseEntity<Object> getAllRoles() {
		
		Set<String> rolesAvailable = userManagementService.getAllRoles();
		
	   return ResponseEntity.ok()
        		.body(rolesAvailable);
	}
	
	@GetMapping("/{username}")
	public ResponseEntity<Object> getUser(@PathVariable String username) {
		
		Optional<UserDetails> optionalUser = userManagementService.findDetails(username);
		
		if(optionalUser.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found");
		}

		return ResponseEntity.ok()
        		.body(optionalUser.get());
	}

	@GetMapping("/enableUser/{userId}")
	public ResponseEntity<?> enableAppUser(@PathVariable("userId") Long userId) {

		appUserService.enableAppUser(userId);

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body("\"User updated successfully.\"");
	}

	@PutMapping("/updateApiUrl")
	public ResponseEntity<?> updateApiUrl(@RequestBody ApiUrlDTO apiUrlDTO) {
		LdapUser userLogged = getCurrentLdapUser();
		Optional<AppUser> res = userManagementService.updateApiUrl(userLogged.getEmail(),apiUrlDTO.getUrl());
		if(res.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found");
		}
		return ResponseEntity.ok().build();
	}



	@GetMapping("/apiUrl")
	public ResponseEntity<String> getApiUrl() {
		LdapUser userLogged = getCurrentLdapUser();
		String apiUrl = userManagementService.userApiUrl(userLogged.getEmail());
		return ResponseEntity.ok().body(apiUrl);
	}
	
	@PostMapping("")
	public ResponseEntity<?> createUser(@RequestBody @Valid LdapUser user) {
		
		LdapUser newUser = userManagementService.create(user); // Create a new user account
		
		LdapUserDTO userDTO = new LdapUserDTO(newUser);
        
	    return ResponseEntity.ok(userDTO);
	}
	
	@PutMapping("")
	public ResponseEntity<?> updateUser(@RequestBody @Valid LdapUserDTO user) {

		LdapUser userLogged = getCurrentLdapUser();

		Optional<LdapUser> res = userManagementService.update(userLogged,user);

		if(res.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found");
		}
		
		LdapUserDTO userDTO = new LdapUserDTO(res.get());
	    
	    return ResponseEntity.ok(userDTO);
	}
	
	@PutMapping("/{username}/password")
	public ResponseEntity<?> updateUserPassword(@RequestBody @Valid UserCredentials userCredentials, @PathVariable String username) {
		
		if(!userCredentials.getUsername().equals(username)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username doesn't match");
		}
		
		// Check that the new password and its confirmation match
		if(!userCredentials.getNewPassword().equals(userCredentials.getNewPasswordConfirm())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password does not match");
		}
		
		// Check that the user exists
		getLdapUser(username); 
		
		Optional<LdapUser> userModified = userManagementService.updatePassword(userCredentials.getUsername(), userCredentials.getNewPassword());
		LdapUserDTO userModifiedDTO = new LdapUserDTO(userModified.get());
        
        return ResponseEntity.ok(userModifiedDTO);
	}
	
	@PutMapping("/{username}/roles")
	public ResponseEntity<?> updateUserRoles(@RequestBody @Valid RoleWrapper roleWrapper, @PathVariable String username) {
		
		LdapUser user = getLdapUser(username);
		
		LdapUser userModified = userManagementService.updateUserRoles(user, roleWrapper.getRoles());
		LdapUserDTO userModifiedDTO = new LdapUserDTO(userModified);
        
        return ResponseEntity.ok(userModifiedDTO.getRoles());
	}
	
	@DeleteMapping("/{username}")
	public ResponseEntity<?> deleteUser(@PathVariable String username) {
		
		LdapUser user = getLdapUser(username); // Check if the user exists
			
		userManagementService.delete(user);
		
		return ResponseEntity.noContent().build();
	}
	
	private LdapUser getLdapUser(String username) throws ResponseStatusException {
		
		Optional<LdapUser> optionalUser = userManagementService.find(username);
		
		if(optionalUser.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found");
		}
		return optionalUser.get();
	}


	private String getCurrentUsername() {
		UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
		String currentUsername = auth.getPrincipal().toString();
		return currentUsername;
	}

	private LdapUser getCurrentLdapUser() throws ResponseStatusException {
		Optional<LdapUser> optionalUser = getOptionalCurrentLdapUser();
		if (optionalUser.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found");
		}
		return optionalUser.get();
	}

	private Optional<LdapUser> getOptionalCurrentLdapUser() throws ResponseStatusException {
		String username = getCurrentUsername();
		Optional<LdapUser> optionalUser = ldapService.find(username);
		return optionalUser;
	}




}
