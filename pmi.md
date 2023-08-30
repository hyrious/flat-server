# 个人房间号 (<abbr title="Personal Meeting ID">PMI</abbr>) 相关接口设计

## 需求分析

- 个人设置页里增加「个人房间号」选项，开启后会得到一个固定的数字，这个数字和帐号永久绑定不会改变。
- 创建（预定）房间时，增加「使用个人房间号」选项，勾选后创建的房间的短号固定设为当前用户的个人房间号。
- 上面一行有可能会创建出同号（短号）的房间，这种冲突我们不做处理，使用短号进入房间时固定进入第一个能查到的房间。
  - 由于邀请链接里还是长的 `roomUUID`，所以仍然可以通过链接加入短号进不了的房间。
  - 如果要保证链接也指向同一房间，必须在前端（三端）各自实现一个中转：
    - Web 上让加入房间页面支持通过短号进入；
    - Electron 和移动端要支持新的 URL 协议。
  - 上面一行的问题是，这么一来有冲突的房间几乎没有人可以进入了，除非拿到长 UUID。
    - 显然创建者自己是有 UUID 的。

## 实现

### 新建 Redis 项 `user:pmi:{userUUID}` &rArr; `{pmi}`

- 创建这条时，对随机出来的 PMI 要去查看是否已存在 `room:invite:{pmi}`。
- PMI 和房间邀请码格式一致，也是 11 位（第一位是区域 ID）。
- 理论上永不过期。

#### 是否需要通过 PMI 反查用户？

- 若需要，则新增 Redis 项 `user:pmiReverse:{pmi}`

### 增加 `/v2/user/pmi` 接口，创建或查询 PMI

```
POST /v2/user/pmi => { "pmi": "10123456789" }
```

### 修改 `/v1/room/create/ordinary` 接口，使其能使用 PMI

```
POST /v1/room/create/ordinary { ..., pmi: true }
=> {
  roomUUID,
  inviteCode: userPMI
}
```

#### 如果需要支持周期性房间

```
POST /v1/room/create/periodic { ..., pmi: true }
=> {}
```
