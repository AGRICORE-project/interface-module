package eu.agricore.ardit.interfac.config.ldap.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class ConfirmPasswordDTO {

    @NotEmpty
    @NotNull
    private String resetPasswordToken;

    @NotEmpty
    @NotNull
    private String userMail;


    public ConfirmPasswordDTO() {
    }

    public String getResetPasswordToken() {
        return resetPasswordToken;
    }

    public void setResetPasswordToken(String resetPasswordToken) {
        this.resetPasswordToken = resetPasswordToken;
    }

    public String getUserMail() {
        return userMail;
    }

    public void setUserMail(String userMail) {
        this.userMail = userMail;
    }
}