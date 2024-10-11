package eu.agricore.ardit.interfac.security;

import eu.agricore.ardit.interfac.util.AuthFailureHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.exceptionHandling().authenticationEntryPoint(new AuthFailureHandler());
		http
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
				.addFilterAfter(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
			.authorizeRequests()
				// Root
				.antMatchers(HttpMethod.GET, "/").permitAll()
				.antMatchers(HttpMethod.GET, "/api/v1").permitAll()
				// Swagger UI
				.antMatchers(
						"/v2/api-docs",
		                "/configuration/ui",
		                "/swagger-resources/**",
		                "/configuration/security",
		                "/swagger-ui.html",
		                "/webjars/**",
		                "/error").hasAnyAuthority("ADMIN","MANTAINER","USER")
				// Auth
				.antMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
				.antMatchers(HttpMethod.GET, "/api/v1/auth/**").permitAll()

				.antMatchers(HttpMethod.POST, "/api/v1/policy/**").permitAll()
				.antMatchers(HttpMethod.GET, "/api/v1/policy/**").permitAll()
				.antMatchers(HttpMethod.PUT, "/api/v1/policy/**").permitAll()
				.antMatchers(HttpMethod.DELETE, "/api/v1/policy/**").permitAll()

				.antMatchers(HttpMethod.POST, "/api/v1/users/**").hasAuthority("ADMIN")
				.antMatchers(HttpMethod.GET, "/api/v1/users/**").hasAuthority("ADMIN")
				.antMatchers(HttpMethod.PUT, "/api/v1/users/**").hasAuthority("ADMIN")
				.antMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasAuthority("ADMIN")

				.antMatchers(HttpMethod.GET, "/api/v1/hive/**").permitAll()

				.antMatchers(HttpMethod.GET, "/api/v1/connection/**").permitAll()
				.anyRequest().authenticated()
			.and()
			.cors()
			.and()
			.csrf().disable()
			.headers()
	        .xssProtection()
	        .and()
	        .contentSecurityPolicy("script-src 'self'");
	}
	
	// Remove comments to allow public access to swagger interface
    /*@Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(// 
        		"/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**",
                "/error");
    }*/
	
}
