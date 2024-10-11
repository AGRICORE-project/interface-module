package eu.agricore.ardit.interfac.repository;

import eu.agricore.ardit.interfac.model.Policy;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PolicyRepository extends CrudRepository<Policy, Long> {


    List<Policy> findByAppUserId(Long userId);

}
