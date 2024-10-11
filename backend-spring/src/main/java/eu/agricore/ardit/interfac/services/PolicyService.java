package eu.agricore.ardit.interfac.services;

import eu.agricore.ardit.interfac.config.ldap.dto.PolicyDTO;
import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.service.LdapUserService;
import eu.agricore.ardit.interfac.model.AppUser;
import eu.agricore.ardit.interfac.model.Policy;
import eu.agricore.ardit.interfac.repository.PolicyRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;
    @Autowired
    private LdapUserService ldapUserService;
    @Autowired
    private AppUserService appUserService;

    private final ModelMapper modelMapper = new ModelMapper();


    @Transactional(readOnly = true)
    public List<Policy> findAll() {
        return (List<Policy>) policyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Policy> finById(Long id) {
        return policyRepository.findById(id);
    }

    @Transactional
    public Policy save(PolicyDTO policyDTO) {

        Policy result;
        Policy policySave = policyDTOToPolicy(policyDTO);
        Date now = new Date();

        LdapUser ldapUser = ldapUserService.getCurrentLdapUser();
        AppUser appUser = appUserService.findAppUserByEmail(ldapUser.getEmail());

        if(policyDTO.getId()==null){
            policySave.setCreatedAt(now);
        }else{
            policySave.setModifiedAt(now);
        }

        policySave.setAppUser(appUser);

        result = policyRepository.save(policySave);

        return result;

    }


    @Transactional
    public void delete(Long id) {
        policyRepository.deleteById(id);
    }


    public Optional<List<Policy>> findByAppUserId(Long userId) {
        return Optional.ofNullable(policyRepository.findByAppUserId(userId));

    }


    private Policy policyDTOToPolicy(PolicyDTO policyDTO) {
        return modelMapper.map(policyDTO, Policy.class);
    }

    private PolicyDTO policyToPolicyDTO(Policy policy) {
        return modelMapper.map(policy, PolicyDTO.class);
    }

}
