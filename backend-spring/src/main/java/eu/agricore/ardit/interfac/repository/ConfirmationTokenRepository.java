package eu.agricore.ardit.interfac.repository;


import eu.agricore.ardit.interfac.model.ConfirmationToken;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConfirmationTokenRepository extends CrudRepository<ConfirmationToken, Long> {
	
	Optional<ConfirmationToken> findByToken(String token);
	
	@Modifying
	@Query("delete from ConfirmationToken where appUser.id = :#{#userId}")
	void deleteByUser(@Param("userId")Long userId);

	@Query("SELECT ct FROM ConfirmationToken ct WHERE ct.appUser.id = :#{#userId} and ct.type='PASSWORD' and ct.confirmedAt is null")
	List<ConfirmationToken> getTokenPasswordByUser(Long userId);

	@Query("SELECT ct FROM ConfirmationToken ct WHERE ct.appUser.id = :#{#userId} and ct.type='REGISTRATION' and ct.confirmedAt is null")
	List<ConfirmationToken> getTokenRegisterByUser(Long userId);


}
