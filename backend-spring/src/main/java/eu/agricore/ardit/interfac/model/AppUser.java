package eu.agricore.ardit.interfac.model;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Entity
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty()
    @Column(name = "full_name")
    private String fullName;

    @NotEmpty()
    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "last_login")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLogin;

    @Column(name = "verified")
    private Boolean verified;

    @Column(name = "disabled")
    private Boolean disabled;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "delete_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deleteAt;

    @Column(name = "country")
    private String country;

    @Column(name = "institution")
    private String  institution;

    @Column(name = "api_url")
    private String  apiUrl;

    public AppUser() {
    }

    public AppUser(@NotEmpty String fullName, @NotEmpty String email, Date lastLogin, Boolean verified,
                   Boolean disabled, Boolean deleted, Date deleteAt) {

        this.fullName = fullName;
        this.email = email;
        this.lastLogin = lastLogin;
        this.verified = verified;
        this.disabled = disabled;
        this.deleted = deleted;
        this.deleteAt = deleteAt;

    }

    public Long getId() {
        return id;
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

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
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

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public Date getDeleteAt() {
        return deleteAt;
    }

    public void setDeleteAt(Date deleteAt) {
        this.deleteAt = deleteAt;
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

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }
}
