package eu.agricore.ardit.interfac.config.ldap.dto;

import javax.validation.constraints.NotEmpty;

public class AuthRequest {
	
	@NotEmpty()
	private String email;
	
	@NotEmpty()
	private String password;
	
	public AuthRequest(String username, String password) {
		this.email = username;
		this.password = password;
	}
	
	public String getEmail() {
		return email;
	}
	public AuthRequest setEmail(String email) {
		this.email = email;
		return this;
	}
	public String getPassword() {
		return password;
	}
	public AuthRequest setPassword(String password) {
		this.password = password;
		return this;
	}
	
	
}
