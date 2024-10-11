package eu.agricore.ardit.interfac.config.ldap.dto;

import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.model.AppUser;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

public class PolicyDTO {


    private Long id;


    private String title;


    private String code;


    private Date derogationDate;


    private Date startDate;

    private Boolean disabled;


    private String country;


    private String region;


    private String xmlFile;


    private String type;


    private Boolean general;


    private Date createdAt;


    private Date modifiedAt;


    public PolicyDTO() {

    }


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Date getDerogationDate() {
		return derogationDate;
	}

	public void setDerogationDate(Date derogationDate) {
		this.derogationDate = derogationDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
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

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getXmlFile() {
		return xmlFile;
	}

	public void setXmlFile(String xmlFile) {
		this.xmlFile = xmlFile;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean getGeneral() {
		return general;
	}

	public void setGeneral(Boolean general) {
		this.general = general;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getModifiedAt() {
		return modifiedAt;
	}

	public void setModifiedAt(Date modifiedAt) {
		this.modifiedAt = modifiedAt;
	}
}
