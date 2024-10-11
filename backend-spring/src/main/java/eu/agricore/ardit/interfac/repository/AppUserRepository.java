package eu.agricore.ardit.interfac.repository;

import eu.agricore.ardit.interfac.model.AppUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AppUserRepository extends CrudRepository<AppUser, Long> {
	
	@Query("select u.verified from AppUser u where u.email = ?1")
	public Boolean checkIfUserIsVerified(String username);
	
	@Query("select u.disabled from AppUser u where u.email = ?1")
	public Boolean checkIfUserIsDisabled(String username);
	

	@Query("select u from AppUser u where u.email = ?1")
	public AppUser findByEmail(String email);




}
