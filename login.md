# 密码登录相关接口设计

在讲新接口之前我们先看一下现在的表结构和网络接口（已简化）。

| users 表               |
| ---------------------- |
| user_uuid              |
| user_password (未使用) |

| user_phone 表 |
| ------------- |
| user_uuid     |
| phone_number  |

用手机号登录的话，目前只有验证码一种方式，后端接口为:

```
POST /v1/login/phone/sendMessage {phone}
POST /v1/login/phone {phone, code} => {userUUID, token, hasPhone: true}
  这里服务器可以创建用户了
```

第三方登录基本上都是走 callback / redirect_uri，基本步骤为:

```
POST /v1/login/set-auth-uuid {authUUID}
  打开第三方授权登录页，其中 redirect_uri 填后端 callback 地址
    第三方登录成功后跳转到 reidrect_uri 并携带上第三方用户信息
    因为跳转自动 GET /login/{provider}/callback?{state}
      这里服务器可以创建用户了
POST /v1/login/process {authUUID} => {userUUID, token, hasPhone: true}
  这里在原页面轮询实现，直到后端返回 200
```

现在要增加使用密码&邮箱的登录/注册/修改/重置密码等接口。

## 增加接口使用 user_password 来注册/登录/修改

首先，我们要给所有登录成功的返回体里多加一个 `hasPassword: boolean` 来表示是否有设置密码，以便 UI 上显示设置新密码时是否需要输入旧密码。这里大概有以下几个接口:

```
POST /v1/login
POST /v1/login/process
POST /v1/login/phone
```

在本次修改中还有以下接口:

```
POST /v1/user/bindingPhone
POST /v2/login/phone
POST /v2/login/email
```

### 注册

原来注册和登录属于一个接口 `login/phone {phone, code}`，里面会自动创建用户。现在额外有一个注册页，里面要填写手机号、验证码、密码来注册。

```console
POST /v2/register/phone/sendMessage {phone}
POST /v2/register/phone {phone, code, password}
  这里服务器可以创建用户了
```

注意，服务器不要直接存密码，要存 `hash(密码)`，后面各种校验也是直接比较 hash。

### 登录

```console
POST /v2/login/phone {phone, password} => {userUUID, token, hasPhone: true}
```

### 修改密码 (需要 Auth)

```console
POST /v2/user/password {password?,newPassword}
```

`password` 为旧密码，可能没有旧密码 (前文返回的 `hasPassword`)。

注意：这里要求旧密码如果存在，必须填入来验证。

### 忘记/重置密码

```console
POST /v2/reset/phone/sendMessage {phone}
POST /v2/reset/phone {phone, code, password}
```

## 增加 user_email 表用来邮箱注册/登录/修改密码/重置密码

| user_email 表 |
| ------------- |
| user_uuid     |
| email (唯一)  |

### 注册

```console
POST /v2/register/email/sendMessage {email}
POST /v2/register/email {email, code, password}
  这里服务器可以创建用户了
```

### 登录

```console
POST /v2/login/email {email, password} => {userUUID, token, hasPhone: true}
```

### 忘记/重置密码 (无 Auth 情况)

```console
POST /v2/reset/email/sendMessage {email}
POST /v2/reset/email {email, password}
```

### 绑定邮箱 (需要 Auth)

```console
POST /v1/user/binding/email/sendMessage {email}
POST /v1/user/binding/email {email, code}
```

### 解绑邮箱 (需要 Auth)

```console
POST /v1/user/binding/remove {target: "Email"}
```

## 附加任务：第三方注册绑定手机号流程简化

现在的流程是，后端登录成功的接口里有个 `hasPhone: boolean`，

```
如果 hasPhone == false 而且要求绑定手机（国内）:
    跳到绑定手机页

绑定手机页:
    POST /v1/user/bindingPhone {phone, code} => Error: SMSAlreadyBinding
    报错为 “该手机在数据库中已被绑定”
```

实际上新的第三方号里面没有任何数据，可以把这个流程变为直接绑定这个第三方到现有账号上。

可能的实现：前端询问用户是否合并账号，再发起一个请求将当前账号的第三方信息导入给现有账号，并删除当前账号。

```console
POST /v2/user/rebindPhone {phone} => {WeChat: 0, Github: 1, Google: -1}
  -1 = 两个账号都没绑定过该平台
   0 = 导入成功
   1 = 导入失败，不能覆盖已经有的绑定
```

## 小计

以上，一共新增了 1 张表、13 个新接口，修改了 4 个旧接口。
