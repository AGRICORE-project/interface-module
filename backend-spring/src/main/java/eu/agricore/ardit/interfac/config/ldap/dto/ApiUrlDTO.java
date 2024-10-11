package eu.agricore.ardit.interfac.config.ldap.dto;

public class ApiUrlDTO {


    private String url;

    public ApiUrlDTO() {

    }

    public ApiUrlDTO(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
