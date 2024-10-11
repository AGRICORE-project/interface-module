package eu.agricore.ardit.interfac.config.ldap.dto;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import com.sun.istack.NotNull;

import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;

public class LdapUserDTO {
	
	@NotNull()
	@NotEmpty()
	private String fullName;
	
	@NotNull()
	@NotEmpty()
	@Email()
	private String email;
    
	private Set<String> roles;

	private String institution;

	private String country;

	private String apiUrl;


	
	public LdapUserDTO() {

	}

	public LdapUserDTO(LdapUser user) {
		this.fullName = user.getFullName();
		this.email = user.getEmail();
		this.roles = user.getRoles();
		this.country = user.getCountry();
		this.institution = user.getInstitution();
	}

	public String getFullName() {
		return fullName;
	}


	public LdapUserDTO setFullName(String username) {
		this.fullName = username;
		return this;
	}

	public String getEmail() {
		return email;
	}

	public LdapUserDTO setEmail(String email) {
		this.email = email;
		return this;
	}

	public Set<String> getRoles() {
		return roles;
	}

	public LdapUserDTO setRoles(Set<String> roles) {
		this.roles = roles;
		return this;
	}

	public String getInstitution() {
		return institution;
	}

	public void setInstitution(String institution) {
		this.institution = institution;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}


	public String getApiUrl() {
		return apiUrl;
	}

	public void setApiUrl(String apiUrl) {
		this.apiUrl = apiUrl;
	}
}
