# 环境搭建

- 添加依赖

创建一个`spring-boot`项目，分别需要web、security、thymeleaf、lombok、test等依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

- 添加配置文件
在`src/main/resources` 下添加文件`spplication.yml`,并添加配置内容

```yaml
spring:
  thymeleaf:
    mode: HTML
    cache: false
    encoding: UTF-8
    prefix: file:src/main/resources/templates/
```

`prefix`配置表示模板引擎直接从`src/main/resources/templates/` 下读取页面文件，这样配置是为了在服务启动后，修改页面内容，不需要重启服务，只要刷新页面就可以了

> `prefix: file:src/main/resources/templates/` 只在本地开发时使用

- 增加首页
在`src/main/resources/templates/`下增加页面`index.html`

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Security学习</title>
</head>
<body>
    <h1>学习Security</h1>
</body>
</html>
```
- 添加启动类

在`src/main/java`下添加包`org.security`，创建类`SecuritySampleApplication`

```java
package org.security;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SecuritySampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecuritySampleApplication.class, args);
    }

}

```

- 启动程序，进行登录 

执行`SecuritySampleApplication`中的`main`方法，注意看控制台的日志，会看到
```java
Using generated security password: 0a51b96e-1ef6-45f1-b545-6e6bffd96916
```
后面的字符串是框架提供的一个随机密码，我们可以在浏览器中访问`http://localhost:8080`,会发现浏览器自动跳转到了`http://localhost:8080/login`,页面会显示一个登录的表单，在表单中输入用户名`user`，密码就是刚才控制台中显示的随机密码`0a51b96e-1ef6-45f1-b545-6e6bffd96916`,然后回车登录，浏览器就跳转到了我们前面添加的`index.html`中


- 退出登录

在浏览器地址栏中输入`http://localhost:8080/logout`，浏览器会跳转到一个确认退出的页面，点击页面中的`Log Out`按钮，页面就会跳转到登录页面，此时就已经退出了系统

- 自定义用户名密码

在`application.yml`中增加配置
```yaml
spring:
  security:
    user:
      password: 123
      name: admin
```

重新启动应用，此时，控制台的日志中就不会再出现随机的密码，访问`http://localhost:8080`可以进行登录