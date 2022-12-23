# 自定义认证
`spring security`默认提供了`user`用户，我们也可以在配置文件中自定义一个用户，但是这远远不能满足我们的需求，我们还需要更多的可能，所以我们要对`spring security`做一些配置

## 创建配置类


创建一个`WebSecurityConfigurerAdapter`的子类作为`spring security`的配置类

```java
package org.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {



}

```

## 密码加密

在新版本的`spring security`中，不再支持明文密码，所以首先要指定密码加密规则，我们这里采用框架中推荐的加密规则,在`SecurityConfig`中增加方法，创建密码加密对象

```java
@Bean
public PasswordEncoder passwordEncoder(){
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}

```


## 内存数据登录

在`SecurityConfig` 重写父类的方法，将用户添加到内存中,并且要将配置文件中配置的用户信息删除

```java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.inMemoryAuthentication()
            .withUser("admin")
            .password(passwordEncoder().encode("1234"))
            .authorities("ROLE_ADMIN");
}
```

此时我们启动应用，从浏览器中访问`http://localhost:8080`,然后从框架提供的默认登录页面中，进行登录



## 数据库数据登录

- 添加jpa依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.20</version>
</dependency>

```

- 增加配置

```yaml

spring:
  thymeleaf:
    mode: HTML
    cache: false
    encoding: UTF-8
    prefix: file:src/main/resources/templates/
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/security?serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    show-sql: true
    hibernate:
      ddl-auto: update
```

 `spring security`中对基于数据库的认证的方式规定，要实现`org.springframework.security.core.userdetails.UserDetailsService` 接口，并且要实现 `UserDetails loadUserByUsername(String username) throws UsernameNotFoundException`方法，`loadUserByUsername`方法中的参数`username`就是用户从页面中输入的用户名，根据这个用户名，查询用户信息，并且返回一个`org.springframework.security.core.userdetails.UserDetails` 对象，`UserDetails`是一个接口，这个接口定义了用户信息的方法

 1. `String getUsername();` 获取用户名
 2. `String getPassword();` 获取密码
 3. `boolean isAccountNonExpired();` 账户是否未过期
 4. `boolean isAccountNonLocked();` 账户是否未锁定
 5. `boolean isCredentialsNonExpired();` 密码是否未过期
 6. `boolean isEnabled();` 是否可用
 7. `Collection<? extends GrantedAuthority> getAuthorities();` 该用户的权限

 因此我们定义的数据库用户要包含这些信息

 
 - 创建用户信息`SysUser`
 ```java
package org.security.model;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Set;

@Data
@Table(name = "sys_user")
@Entity
public class SysUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String password;

    private String username;

    @Column(name = "account_non_expired")
    private boolean accountNonExpired;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked;

    @Column(name = "credentials_non_expired")
    private boolean credentialsNonExpired;

    private boolean enabled;


    @Transient
    private Set<GrantedAuthority> authorities;
}

 ```

 - `UserDao`提供根据用户名查询的方法

 ```java
package org.security.dao;

import org.security.model.SysUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<SysUser,Long> {

    SysUser findByUsername(String username);
}
 ```

 -  `UserService`实现`UserDetailsService`接口
 ```java
package org.security.service;

import org.security.dao.UserDao;
import org.security.model.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser user = this.userDao.findByUsername(username);
        if(user == null){
            throw  new UsernameNotFoundException("用户不存在");
        }
        return user;
    }
}

 ```

 - 添加测试数据

 ```java
 package org.security;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.security.dao.UserDao;
import org.security.model.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SecuritySampleApplicationTests {


    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testAddUser() {

        SysUser user = new SysUser();
        user.setUsername("admin");
        user.setPassword(passwordEncoder.encode("123456"));
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);
        user.setAccountNonLocked(true);
        user.setEnabled(true);
        userDao.save(user);
    }

}
```

- 修改配置

修改`spring security`配置类`SecurityConfig`

```java
package org.security.config;

import org.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {


    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }


    @Autowired
    private UserService userService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }
}
```

在浏览器中访问`http://localhost:8080`,使用添加到数据库中的用户密码进行登录



