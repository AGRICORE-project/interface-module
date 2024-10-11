package eu.agricore.ardit.interfac.config;

import eu.agricore.ardit.interfac.config.ldap.config.LdapConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    private static final Logger logger = LoggerFactory.getLogger(AppConfig.class);
    @Autowired
    LdapConfig ldapConfig;
    @Value("${hive.uri}")
    private String databaseUri;
    @Value("${hive.password}")
    private String password;
    @Value("${hive.username}")
    private String username;
    @Value("${hive.driver-class-name}")
    private String driverClassName;

//    @Bean(name = "jdbcTemplateHive")
//    public JdbcTemplate getJDBCTemplate() throws IOException {
//        return new JdbcTemplate(getHiveDataSource());
//    }
//
//
//    private DataSource getHiveDataSource() {
//        BasicDataSource dataSource = new BasicDataSource();
//        dataSource.setUrl(databaseUri);
//        dataSource.setDriverClassName(driverClassName);
////        dataSource.setUsername(username);
////        dataSource.setPassword(password);
//        logger.debug("Hive DataSource");
//        return dataSource;
//    }

}
