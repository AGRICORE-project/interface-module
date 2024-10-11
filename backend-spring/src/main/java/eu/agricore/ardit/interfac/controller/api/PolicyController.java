package eu.agricore.ardit.interfac.controller.api;


import eu.agricore.ardit.interfac.config.ldap.dto.PolicyDTO;
import eu.agricore.ardit.interfac.config.ldap.service.LdapUserService;
import eu.agricore.ardit.interfac.model.Policy;
import eu.agricore.ardit.interfac.services.PolicyService;
import eu.agricore.ardit.interfac.util.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/policy")
public class PolicyController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private LdapUserService ldapService;

    @Autowired
    private PolicyService policyService;


    @GetMapping("")
    public ResponseEntity<List<Policy>> getAllPolicies() {

        List<Policy> policyList = policyService.findAll();

        return ResponseEntity.ok()
                .body(policyList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Policy> getPolicyById(@PathVariable Long id) {

        Optional<Policy> policy = policyService.finById(id);

        if (policy.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vocabulary not found");
        }

        return ResponseEntity.ok()
                .body(policy.get());
    }


    @PostMapping("")
    public ResponseEntity<Policy> createPolicy(@RequestBody @Valid PolicyDTO policy) {

        // Save the new vocabulary
        Policy newPolicy = policyService.save(policy);

        return ResponseEntity.ok()
                .body(newPolicy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVocabulary(@RequestBody @Valid PolicyDTO policyDTO, @PathVariable Long id) {

        if (!policyDTO.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Policy id doesn't match");
        }

        if (policyService.finById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found");
        }

        Policy vocabularyModified = policyService.save(policyDTO);

        return ResponseEntity.ok(vocabularyModified);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVocabulary(@PathVariable Long id) {

        if (policyService.finById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Policy not found");
        }

        policyService.delete(id); // Delete the vocabulary
        return ResponseEntity.noContent().build();


    }


}
