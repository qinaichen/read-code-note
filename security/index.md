# Spring Security

作为一个安全管理框架,无论是`shiro`还是`spring security`，核心功能无非就是 **认证** 与 **授权**

## 认证
> 认证就是身份认证(你是谁?)

### 认证信息

在 `Spring Security` 中，用户的认证信息主要由 `Authentication` 的实现类来保存，框架对 `Authentication` 进行了定义：

```java
public interface Authentication extends Principal, Serializable {
    Collection<? extends GrantedAuthority> getAuthorities();
    Object getCredentials();
    Object getDetails();
    Object getPrincipal();
    boolean isAuthenticated();
    void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException;
}
```
- `getAuthorities` 用来获取用户的权限
- `getCredentials` 用来获取用户凭证，一般来说就是密码
- `getDetails` 获取用户携带的详细信息
- `getPrincipal` 获取当前用户
- `isAuthenticated` 当前用户是否认证成功


### 认证管理器

在`Spring Security` 中，认证工作主要由 `AuthenticationManager` 接口来负责

```java
public interface AuthenticationManager {

	Authentication authenticate(Authentication authentication)
			throws AuthenticationException;   
}

```
`AuthenticationManager` 中只有 `authenticate` 方法用来实现认证逻辑，该方法有**三个**不同的返回值

- 返回`Authentication` ,表示认证成功
- 抛出`AuthenticationException` 异常，表示用户输入了无效的凭证
- 返回 null，表示不能断定

## 授权
> 授权就是访问控制(你能做什么?)

授权体系中，两个关键接口分别是
- `AccessDecisionManager` 决策器，来决定此次访问是否被允许
- `AccessDecisionVoter` 投票器，检查用户是否具备应用的角色，进而投出赞成、反对或者弃权票
