```
POST agora/token/generate/rtc (generateRTC) [auth]
results:
  {
      status: Status.Success,
      data: {
          token,
      },
  }
```
```
POST agora/token/generate/rtm (generateRTM) [auth]
results:
  {
      status: Status.Success,
      data: {
          token,
      },
  }
```
```
GET login/weChat/callback/:socketID (callback)
results:
```
```
POST login (login) [auth]
results:
```
```
POST room/create/ordinary (createOrdinary) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/create/periodic (createPeriodic) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/list/:type (list) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/join (join) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/info/ordinary (ordinaryInfo) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/info/periodic (periodicInfo) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/info/periodic-sub-room (periodicSubRoomInfo) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/info/users (userInfo) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/update-status/started (started) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/update-status/paused (paused) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/update-status/stopped (stopped) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/update/ordinary (updateOrdinary) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/update/periodic (updatePeriodic) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/update/periodic-sub-room (updatePeriodicSubRoom) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/cancel/ordinary (cancelOrdinary) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/cancel/periodic (cancelPeriodic) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/cancel/periodic-sub-room (cancelPeriodicSubRoom) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/cancel/history (cancelHistory) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/started (recordStarted) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/stopped (recordStopped) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/update-end-time (recordStopped) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/agora/acquire (recordAgoraAcquire) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/agora/started (recordAgoraStarted) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/agora/query (recordAgoraQuery) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/agora/update-layout (recordAgoraUpdateLayout) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/agora/stopped (recordAgoraStopped) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
```
POST room/record/info (recordInfo) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotFound,
  }
  {
      status: Status.Failed,
      code: ErrorCode.RoomNotIsRunning,
  }
  {
      status: Status.Success,
      data: {},
  }
  {
      status: Status.Failed,
      code: ErrorCode.CurrentProcessFailed,
  }
```
