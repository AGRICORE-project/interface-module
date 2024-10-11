package eu.agricore.ardit.interfac.model.employee;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Employee implements RowMapper<Employee> {

    private Long eid;
    private String name;
    private String destination;
    private Long salary;


    public Long getEid() {
        return eid;
    }

    public void setEid(Long eid) {
        this.eid = eid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Long getSalary() {
        return salary;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    @Override
    public  Employee mapRow(ResultSet resultSet, int i) throws SQLException {
        Employee employee = new Employee();
        employee.setEid((long) resultSet.getInt(1));
        employee.setName(resultSet.getString(2));
        employee.setSalary((long) resultSet.getInt(3));
        return  employee;
    }
}
