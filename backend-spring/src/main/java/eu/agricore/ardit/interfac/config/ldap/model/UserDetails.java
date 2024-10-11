package eu.agricore.ardit.interfac.config.ldap.model;

import eu.agricore.ardit.interfac.model.AppUser;

import java.util.Set;

public class UserDetails {


    private Long id;


    private String fullName;


    private String email;


    private Boolean verified;


    private Boolean disabled;


    private String country;


    private String institution;


    private Set<String> roles;


    public UserDetails() {
    }

    public UserDetails(Long id, String fullName, String email, Boolean verified, Boolean disabled, String country, String institution, Set<String> roles) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.verified = verified;
        this.disabled = disabled;
        this.country = country;
        this.institution = institution;
        this.roles = roles;
    }


    public UserDetails(AppUser appUser, LdapUser ldapUser) {
        this.id = appUser.getId();
        this.fullName = appUser.getFullName();
        this.email = appUser.getEmail();
        this.verified = appUser.getVerified();
        this.disabled = appUser.getDisabled();
        this.country = appUser.getCountry();
        this.institution = appUser.getInstitution();
        this.roles = ldapUser.getRoles();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public Boolean getDisabled() {
        return disabled;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
