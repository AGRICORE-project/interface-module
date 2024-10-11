package eu.agricore.ardit.interfac.controller.api;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/connection")
public class ConnectionController {


    @GetMapping("/check")
    public ResponseEntity<String> checkConnectivity() {

        return ResponseEntity.ok()
                .body("\"Connected\"");
    }


}
