# 自定义登录页
- 创建页面

在`srdc/main/resources/templtes`下创建`login.html`
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>登录</title>
</head>
<body>
    <div>
        <form th:action="@{/login}" method="post">
            <input type="text" name="username"> <br>
            <input type="password" name="password"> <br>
            <input type="submit" value="登录">
        </form>
    </div>
</body>
</html>
```

- 创建控制器`LoginController`

```java
package org.security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class LoginController {

    @GetMapping("/sys/login")
    public String loginPage(){
        return "login";
    }
}
```

- 修改`SecurityConfig`

重写父类`WebSecurityConfigurerAdapter` 的`configure(HttpSecurity http)` 方法

```java
package org.security.config;

import org.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/sys/login")
                .loginProcessingUrl("/login").permitAll();
    }
}
```

启动服务，访问`http://localhost:8080`，登录页面就变成了我们刚才自定义的登录页