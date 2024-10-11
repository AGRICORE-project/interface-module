package eu.agricore.ardit.interfac.config.ldap.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class NewPasswordDTO {

    @NotEmpty()
    @Size(min = 8, message = "The password must be at least 8 characters long")
    private String newPassword;

    @NotEmpty
    @NotNull
    private String resetPasswordToken;

    @NotEmpty
    @NotNull
    private String userMail;


    public NewPasswordDTO() {
    }


    public NewPasswordDTO(String newPassword, String resetPasswordToken) {
        this.newPassword = newPassword;
        this.resetPasswordToken = resetPasswordToken;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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
