# Ajax提交表单

一般的登录我们用`form`表单本身的提交功能，为了能够提升用户体验，我们采用`ajax`的方式去提交登录信息

我们仍然使用`thymeleaf`作为模板引擎，使用`Vue.js`和`Element-ui`进行登录页面开发，采用`axios.js`进行`ajax`交互

## 登录页面
```html
<!doctype html>
<html  xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>登录</title>
    <link href="https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/2.12.0/index.js"></script>
    <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
</head>
<body>
    <div id="login">
        <el-row :gutter="20">
            <el-col :span="5" :offset="1">
                <el-form :model="user" ref="loginForm" label-width="120px" :rules="rules">
                    <el-form-item prop="username" label="用户名">
                        <el-input v-model="user.username" placeholder="用户名"></el-input>
                    </el-form-item>

                    <el-form-item prop="password" label="密码">
                        <el-input v-model="user.password" placeholder="密码" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
    <script th:inline="javascript">
        new Vue({
            el:'#login',
            data:function(){
                return {
                    user:{
                        username:'',
                        password:''
                    },
                    rules:{
                        username:[
                            {required:true,message:'请输入用户名',trigger:'blur'}
                        ],
                        password:[
                            {required:true,message:'请输入密码',trigger:'blur'}
                        ]
                    }
                }
            },
            methods:{
                login:function(){
                    var vm = this;
                    vm.$refs.loginForm.validate(function(valid){
                        if(valid){
                            vm.submitData();
                        }
                    });
                },
                submitData:function(){
                    var vm = this;
                    var formData = new FormData();
                    for(var item in vm.user){
                        formData.append(item,vm.user[item]);
                    }
                    axios.post('/login',formData).then(function (res) {
                        var result = res.data;
                        if(result.code == 200){
                            location.href = '/';
                        }else{
                            vm.$alert(result.msg);
                        }
                    });
                }
            }
        });
    </script>

</body>
</html>
```

## 登录结果处理

`Spring Security`默认的登录结果处理是跳转页面，在我们使用`ajax`提交登录信息后，页面需要后台返回`JSON`格式的处理结果数据，所以我们要自定义认真的结果处理

- 登录成功结果处理

如果用户名密码校验成功，需要向浏览器返回登录成功的结果，这个结果是在 `AuthenticationSuccessHandler` 中进行处理的，所以我们要对 `AuthenticationSuccessHandler`进行自定义的实现，浏览器在收到登录成功的信息后，进行页面他跳转
```java
package org.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class LoginSuccessHandler implements  AuthenticationSuccessHandler{


    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Map<String,Object> result = new HashMap<>();
        log.info("登录成功");
        result.put("code", 200);
        result.put("message", "登录成功");
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}

```

- 登录失败结果处理

服务器对用户名和密码的校验没有通过，登录失败，需要返回登录失败结果，在`AuthenticationFailureHandler` 中进行处理，对其进行自定义实现，浏览器收到返回信息后，向用户提示失败信息

```java
package org.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class LoginFailureHandler implements AuthenticationFailureHandler {


    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        Map<String, Object> map = new HashMap<>();
        log.info("登录失败" +
                "");
        map.put("code","1002");
        map.put("msg","登录失败");
        map.put("data",exception.getMessage());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(map));
    }
}

```

## 修改配置

将登录成功和失败的处理方式添加到配置中

```java
package org.security.config;

import org.security.handler.LoginFailureHandler;
import org.security.handler.LoginSuccessHandler;
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

    @Autowired
    private LoginSuccessHandler loginSuccessHandler;

    @Autowired
    private LoginFailureHandler loginFailureHandler;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().anyRequest().authenticated()
                .and()
                .formLogin().successHandler(loginSuccessHandler)
                .failureHandler(loginFailureHandler).loginPage("/sys/login")
                .loginProcessingUrl("/login").permitAll()
        .and().csrf().disable();
    }
}
```

