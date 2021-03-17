```
POST agora/token/generate/rtc (generateRTC) [auth]
body:
  interface GenerateRTCBody {
      roomUUID: string;
  }
results:

POST agora/token/generate/rtm (generateRTM) [auth]
results:

POST cloud-storage/list (list) [auth]
query:
  interface ListQuery {
      page: number;
      is_delete?: number;
  }
results:

POST cloud-storage/rename (renameFile) [auth]
body:
  interface RenameFileBody {
      fileUUID: string;
      fileName: string;
  }
results:

POST cloud-storage/delete (deleteFile) [auth]
body:
  interface DeleteFileBody {
      fileUUID: string;
      force?: boolean;
  }
results:

POST cloud-storage/convert/start (convertStart) [auth]
body:
  interface ConvertStartBody {
      fileUUID: string;
  }
results:

POST cloud-storage/convert/finish (convertFinish) [auth]
body:
  interface ConvertFinishBody {
      fileUUID: string;
  }
results:

GET login/weChat/callback/:socketID (callback)
params:
  interface CallbackParams {
      socketID: string;
  }
query:
  interface CallbackQuery {
      state: string;
      code: string;
  }
results:

POST login (login) [auth]
results:

POST room/create/ordinary (createOrdinary) [auth]
body:
  interface CreateOrdinaryBody {
      title: string;
      type: RoomType;
      beginTime: number;
      endTime?: number;
      docs?: Docs[];
  }
results:

POST room/create/periodic (createPeriodic) [auth]
body:
  interface CreatePeriodicBody {
      title: string;
      type: RoomType;
      beginTime: number;
      endTime: number;
      periodic: Periodic;
      docs?: Docs[];
  }
results:

POST room/list/:type (list) [auth]
params:
  interface ListParams {
      type: ListType;
  }
query:
  interface ListQuery {
      page: number;
  }
results:

POST room/join (join) [auth]
body:
  interface JoinBody {
      uuid: string;
  }
results:

POST room/info/ordinary (ordinaryInfo) [auth]
body:
  interface OrdinaryInfoBody {
      roomUUID: string;
      needDocs: boolean;
  }
results:

POST room/info/periodic (periodicInfo) [auth]
body:
  interface PeriodicInfoBody {
      periodicUUID: string;
  }
results:

POST room/info/periodic-sub-room (periodicSubRoomInfo) [auth]
body:
  interface PeriodicSubRoomInfoBody {
      roomUUID: string;
      periodicUUID: string;
      needOtherRoomTimeInfo?: boolean;
  }
results:

POST room/info/users (userInfo) [auth]
body:
  interface UserInfoBody {
      roomUUID: string;
      usersUUID: string[];
  }
results:

POST room/update-status/started (started) [auth]
body:
  interface StartedBody {
      roomUUID: string;
  }
results:

POST room/update-status/paused (paused) [auth]
body:
  interface PausedBody {
      roomUUID: string;
  }
results:

POST room/update-status/stopped (stopped) [auth]
body:
  interface StoppedBody {
      roomUUID: string;
  }
results:

POST room/update/ordinary (updateOrdinary) [auth]
body:
  interface UpdateOrdinaryBody {
      roomUUID: string;
      beginTime: number;
      endTime: number;
      title: string;
      type: RoomType;
      docs: Docs[];
  }
results:

POST room/update/periodic (updatePeriodic) [auth]
body:
  interface UpdatePeriodicBody {
      periodicUUID: string;
      beginTime: number;
      endTime: number;
      title: string;
      type: RoomType;
      periodic: Periodic;
      docs: Docs[];
  }
results:

POST room/update/periodic-sub-room (updatePeriodicSubRoom) [auth]
body:
  interface UpdatePeriodicSubRoomBody {
      periodicUUID: string;
      roomUUID: string;
      beginTime: number;
      endTime: number;
  }
results:

POST room/cancel/ordinary (cancelOrdinary) [auth]
body:
  interface CancelOrdinaryBody {
      roomUUID: string;
  }
results:

POST room/cancel/periodic (cancelPeriodic) [auth]
body:
  interface CancelPeriodicBody {
      periodicUUID: string;
  }
results:

POST room/cancel/periodic-sub-room (cancelPeriodicSubRoom) [auth]
body:
  interface CancelPeriodicSubRoomBody {
      periodicUUID: string;
      roomUUID: string;
  }
results:

POST room/cancel/history (cancelHistory) [auth]
body:
  interface CancelHistoryBody {
      roomUUID: string;
  }
results:

POST room/record/started (recordStarted) [auth]
body:
  interface RecordStartedBody {
      roomUUID: string;
  }
results:

POST room/record/stopped (recordStopped) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:

POST room/record/update-end-time (recordStopped) [auth]
body:
  interface RecordStoppedBody {
      roomUUID: string;
  }
results:

POST room/record/agora/acquire (recordAgoraAcquire) [auth]
body:
  interface RecordAgoraAcquireBody {
      roomUUID: string;
      agoraData: AgoraCloudRecordAcquireRequestBody;
  }
results:

POST room/record/agora/started (recordAgoraStarted) [auth]
body:
  interface RecordAgoraStartedBody {
      roomUUID: string;
      agoraParams: AgoraCloudRecordParamsBaseType;
      agoraData: AgoraCloudRecordStartedRequestBody;
  }
results:

POST room/record/agora/query (recordAgoraQuery) [auth]
body:
  interface RecordAgoraQueryBody {
      roomUUID: string;
      agoraParams: AgoraCloudRecordParamsType;
  }
results:

POST room/record/agora/update-layout (recordAgoraUpdateLayout) [auth]
results:

POST room/record/agora/stopped (recordAgoraStopped) [auth]
body:
  interface RecordAgoraStoppedBody {
      roomUUID: string;
      agoraParams: AgoraCloudRecordParamsType;
  }
results:

POST room/record/info (recordInfo) [auth]
body:
  interface RecordInfoBody {
      roomUUID: string;
  }
results:

```
