package eu.agricore.ardit.interfac.config.ldap.model;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.sun.istack.NotNull;

public class LdapUser {

	@NotNull()
	@NotEmpty()
	private String fullName;
	
	@NotNull()
	@NotEmpty()
	@Size(min = 8, message = "The password must be at least 8 characters long")
	private String password;
	
	@NotNull()
	@NotEmpty()
	@Email()
	private String email;


	private Set<String> roles;

	private String institution;

	private String country;


	public LdapUser() {
		this.fullName = new String();
		this.password = new String();
		this.email = new String();
		this.roles = new HashSet<String>();
	}
	
	public LdapUser(String username, String password, String email) {
		this.fullName = username;
		this.password = password;
		this.email = email;
		this.roles = new HashSet<>();
	}
	
	public LdapUser(String username, String password, String email, Set<String> roles) {
		this.fullName = username;
		this.password = password;
		this.email = email;
		this.roles = roles;
	}

	
	public String getFullName() {
		return fullName;
	}

	public LdapUser setFullName(String username) {
		this.fullName = username;
		return this;
	}

	public String getPassword() {
		return password;
	}

	public LdapUser setPassword(String password) {
		this.password = password;
		return this;
	}

	public String getEmail() {
		return email;
	}

	public LdapUser setEmail(String email) {
		this.email = email;
		return this;
	}

	public Set<String> getRoles() {
		return roles;
	}

	public LdapUser setRoles(Set<String> roles) {
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
}
