package eu.agricore.ardit.interfac.controller.api;


import eu.agricore.ardit.interfac.hive.HiveService;
import eu.agricore.ardit.interfac.model.employee.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/hive")
public class HiveController {


    @Autowired
    private HiveService hiveService;


//    @RequestMapping("/select")
//    public ResponseEntity<List<Employee>> select() {
//
//        String sql = " select * from default.employee_test ";
//        List<Employee> result = hiveService.selectQuery(sql, new Employee());
//        return ResponseEntity.ok().body(result);
//
//    }
//
//
//    @RequestMapping("/insert")
//    public ResponseEntity<?> insert() {
//
//        String sqlInsert = " INSERT " + "INTO " + "public.app_user (id,delete_at, " + "deleted, " + "disabled, " +
//                "email, " +
//                "last_login, " +
//                "username, " +
//                "verified) " +
//                "VALUES(2,NULL, " +
//                "false, " +
//                "false, " +
//                "'lbarcelo.juanjo@gmail.com', " +
//                "NULL, " +
//                "'test', " +
//                "false) ";
//
//        hiveService.executeQuery(sqlInsert);
//
//        return ResponseEntity.ok().body("ok");
//
//    }


}
