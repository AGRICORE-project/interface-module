package eu.agricore.ardit.interfac.controller.api;


import eu.agricore.ardit.interfac.config.ldap.dto.*;
import eu.agricore.ardit.interfac.config.ldap.model.LdapUser;
import eu.agricore.ardit.interfac.config.ldap.service.LdapUserService;
import eu.agricore.ardit.interfac.config.ldap.util.Utils;
import eu.agricore.ardit.interfac.model.AppUser;
import eu.agricore.ardit.interfac.model.ConfirmationToken;
import eu.agricore.ardit.interfac.services.AppUserService;
import eu.agricore.ardit.interfac.services.ConfirmationTokenService;
import eu.agricore.ardit.interfac.util.JWTService;
import eu.agricore.ardit.interfac.util.ResponseCookieUtil;
import eu.agricore.ardit.interfac.util.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private LdapUserService ldapService;

    @Autowired
    private ResponseCookieUtil responseCookieUtil;

    @Autowired
    private AppUserService appUserService;

    @Autowired
    private ConfirmationTokenService confirmationTokenService;

    @Autowired
    private UserAccountService userAccountService;


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest authRequest, HttpServletResponse httpResponse) throws URISyntaxException {

        String email = authRequest.getEmail();
        String password = authRequest.getPassword();

        // Authenticate by LDAP
        Boolean authenticated = ldapService.authenticate(email, password);
        if (!authenticated) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad credentials");
        }

        // Check if user is verified
        if (!appUserService.checkIfUserIsVerified(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your email address is not verified");
        }

        // Check if the user account is disabled
        if (!appUserService.checkIfUserIsDisabled(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your user account has been blocked");
        }

        // LDAP roles recovery
        Set<String> roles = ldapService.getRolesByUser(email);

        // Token generation
        String token = jwtService.generateToken(email, roles);

        // AuthResponse
        AuthResponse res = new AuthResponse(token);

        // Cookie to store jwt token value on the client browser
        ResponseCookie cookie = responseCookieUtil.createTokenCookie(token);
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        appUserService.setAppUserLastLogin(email);

        return ResponseEntity.ok()
                .body(res);
    }

    @GetMapping("/me")
    public ResponseEntity<LdapUserDTO> getCurrentUser() {

        LdapUser user = ldapService.getCurrentLdapUser();
        Set<String> rol = userAccountService.getUserRole(user.getRoles());
        AppUser appUser = appUserService.findAppUserByEmail(user.getEmail());
        String country = appUser.getCountry();
        String institution = appUser.getInstitution();

        LdapUserDTO userDTO = new LdapUserDTO();

        userDTO.setCountry(country);
        userDTO.setRoles(rol);
        userDTO.setInstitution(institution);
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(appUser.getFullName());
        userDTO.setApiUrl(appUser.getApiUrl());

        return ResponseEntity.ok()
                .body(userDTO);
    }


    @PostMapping("/recoverPassword")
    public ResponseEntity<?> recoverPassword(@RequestBody @Valid ResetPasswordDTO resetPasswordDTO /* @RequestParam("email") String email */) {

        String email = resetPasswordDTO.getEmail();

        AppUser appUser = appUserService.findAppUserByEmail(email);

        if (appUser == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The email can not be found in the database");
        }

        // Check if user is verified
        if (!appUserService.checkIfUserIsVerified(appUser.getEmail())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your email address is not verified");
        }

        // Check if the user account is disabled
        if (!appUserService.checkIfUserIsDisabled(appUser.getEmail())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your user account has been blocked");
        }

        // if token already exist delete the old ones
        List<ConfirmationToken> confirmationTokenList = confirmationTokenService.getTokenPasswordByUser(appUser.getId());
        if (confirmationTokenList != null && !confirmationTokenList.isEmpty()) {
            for (ConfirmationToken confirmationToken : confirmationTokenList) {
                confirmationTokenService.deleteToken(confirmationToken);
            }
        }

        appUserService.generateUrlResetPassword(appUser);
        return ResponseEntity.ok().body("\"We have sent an email to reset your password, if you can't find it, check your spam folder.\"");

    }


    @PostMapping("/newPassword")
    public ResponseEntity<?> newPassword(@RequestBody @Valid NewPasswordDTO newPasswordDTO) {

        String token = newPasswordDTO.getResetPasswordToken();
        String newPassword = newPasswordDTO.getNewPassword();

        Optional<ConfirmationToken> confirmationToken = confirmationTokenService.getToken(token);

        if (confirmationToken.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not exists");
        }

        // Check if token has been confirmed
        if (confirmationToken.get().getConfirmedAt() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password already changed");
        }

        // Check if token has expired
        Date currentDate = new Date();
        if (currentDate.after(confirmationToken.get().getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");

        }

        if (!(confirmationToken.get().getType().equals(Utils.ConfirmationTokenType.PASSWORD))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token type does not match");
        }

        AppUser appUser = confirmationToken.get().getAppUser();
        String email = appUser.getEmail();


        // Check if user token is for user
        if ((confirmationToken.get().getType().equals(Utils.ConfirmationTokenType.PASSWORD)) && !email.equals(newPasswordDTO.getUserMail())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token not valid");
        }

        // Check if user is verified
        if (!appUserService.checkIfUserIsVerified(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your email address is not verified");
        }

        // Check if the user account is disabled
        if (!appUserService.checkIfUserIsDisabled(email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your user account has been blocked");
        }

        appUserService.updatePassword(email, newPassword, confirmationToken.get());
        //delete token when all the cycle is done
        confirmationTokenService.deleteToken(confirmationToken.get());

        return ResponseEntity.ok().body("\"Your password has been changed, you can sign in now.\"");

    }


    @PostMapping("/password/confirm")
    public ResponseEntity<?> passwordConfirm(@RequestBody @Valid ConfirmPasswordDTO confirmPasswordDTO) {

        Optional<ConfirmationToken> confirmationToken = confirmationTokenService.getToken(confirmPasswordDTO.getResetPasswordToken());

        // Check if token exists
        if (confirmationToken.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not exists");
        }

        // Check if token has been confirmed
        if (confirmationToken.get().getConfirmedAt() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address already confirmed");
        }

        // Check if token has expired
        Date currentDate = new Date();
        if (currentDate.after(confirmationToken.get().getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
        }


        if (!(confirmationToken.get().getType().equals(Utils.ConfirmationTokenType.PASSWORD))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token type does not match");
        }

        confirmationTokenService.confirmToken(confirmationToken.get());

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body("\"Your email address has been confirmed succesfully. You can log in now.\"");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LdapUser user, HttpServletResponse httpResponse) {

        AppUser appUser = appUserService.findAppUserByEmail(user.getEmail());

        if (appUser != null) {
                // if there is a token confirmed to the email, we throw email already in use exception
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The email is already in use");
        }

        // Auth by LDAP
        user = ldapService.create(user);

        // Create app user
        appUserService.registerAppUser(user);

        return ResponseEntity.ok().body("\"Thank you " + user.getFullName() + " for signing up. We will notify you when an admin approves your account. \"");
    }


    @GetMapping("/register/confirm")
    public ResponseEntity<?> confirm(@RequestParam("token") String token) {

        Optional<ConfirmationToken> confirmationToken = confirmationTokenService.getToken(token);

        // Check if token exists
        if (confirmationToken.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not exists");
        }

        // Check if token has been confirmed
        if (confirmationToken.get().getConfirmedAt() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address already confirmed");
        }

        // Check if token has expired
        Date currentDate = new Date();
        if (currentDate.after(confirmationToken.get().getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
        }


        if (!(confirmationToken.get().getType().equals(Utils.ConfirmationTokenType.REGISTRATION))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token type does not match");
        }

        // Confirm token and validate user account
        ConfirmationToken confirmedToken = confirmationTokenService.confirmToken(confirmationToken.get());
        appUserService.enableAppUser(confirmedToken.getAppUser());
        //delete confirmation token when the cycle is completed
        confirmationTokenService.deleteToken(confirmedToken);

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body("\"Your email address has been confirmed succesfully. You can log in now.\"");
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse httpResponse) throws URISyntaxException {

        //Remove Agricore token cookie from the user's browser
        ResponseCookie cookie = responseCookieUtil.deleteTokenCookie();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.noContent().build();
    }









}
