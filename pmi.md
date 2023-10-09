# 个人房间号 (<abbr title="Personal Meeting ID">PMI</abbr>) 相关接口设计

## 需求分析

- 个人设置页里增加「个人房间号」选项，开启后会得到一个固定的数字，这个数字和帐号永久绑定不会改变。
- 创建（预定）房间时，增加「使用个人房间号」选项，勾选后创建的房间的短号固定设为当前用户的个人房间号。
  - 如果已经存在该短号的房间，创建失败

## 实现

### 新建数据库 `user_pmi` 或者 Redis 项 `user:pmi:{userUUID}` &rArr; `{pmi}`

| 字段        | 类型   |
| ----------- | ------ |
| \*user_uuid | string |
| \*pmi       | string |

\*：都是 unique key

- 创建这条时，对随机出来的 PMI 要去查看是否已存在。
- PMI 和房间邀请码格式一致，也是 11 位（第一位是区域 ID）。
- 虽然 PMI 为 11 位，但是周期性房间没有区域性 ID，只能不支持周期性房间。

### 增加 `/v2/user/pmi` 接口，创建或查询自己的 PMI

```
POST /v2/user/pmi { "create": true } => { "pmi": "10123456789" }
```

如果 `create` 为 `false`，那么当不存在 PMI 时不自动创建，返回 `{ "pmi": null }`。

### 增加 `/v2/user/is-pmi` 接口，查询某短号是否是 PMI

```
POST /v2/user/is-pmi { "pmi": "10123456789" } => { "result": true }
```

如果一个号码是 PMI 但不存在房间与之关联，加入房间会报错，这个接口会返回 true。

### 增加 `/v2/room/list/pmi` 接口，查询自己的 PMI 对应的房间

```
POST /v2/room/list/pmi => [{ "roomUUID": "" }]
```

如果 PMI 未创建或不存在这样的房间，返回空数组。

通常来说最多只返回一个房间，但设计为数组以便后续需求。

### 修改 `/v1/room/create/ordinary` 接口，使其能使用 PMI

```
POST /v1/room/create/ordinary { ..., pmi: true }
=> {
  roomUUID,
  inviteCode: userPMI
}
```

如果已存在 PMI 房间，报错:

```js
var uuid = GET room:invite:{pmi}
if exists(uuid) {
  throw new Error('PMI is in use')
}

// 新增条目
SET room:invite:{pmi} => room or periodic uuid
SET room:inviteReverse:{uuid} => {pmi}
```

#### 周期性房间

```
POST /v1/room/create/periodic { ..., pmi: true }
=> {}
```

## UI 设计

- **加入房间**: 如果加入失败，
  - 如果是 PMI 房间 (`/v2/user/is-pmi`)，
    - 显示「房间未开始，请等待老师加入」
  - 否则显示「房间不存在」
- **快速开始**: 如果勾选了使用 PMI，
  - 如果存在 PMI 房间可以进入 (`/v2/room/list/pmi`)，
    - 进入房间 `/v1/room/join`
  - 否则，创建房间 `/v1/room/create/ordinary` 并进入
- **预定房间**: 如果勾选了使用 PMI，
  - 如果存在 PMI 房间可以进入 (`/v2/room/list/pmi`)，
    - 不允许预定，提示「个人房间已存在，请先取消已存在的个人房间」
  - 否则，创建房间 `/v1/room/create/:type`
