package eu.agricore.ardit.interfac.util;

import eu.agricore.ardit.interfac.config.ldap.util.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PlainPasswordEncoder implements PasswordEncoder {

	@Override
	public String encondePassword(String password) {
		return password;
	}

}
