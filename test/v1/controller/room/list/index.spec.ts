import { describe } from "mocha";
import { v4 } from "uuid";
import { Logger } from "../../../../../src/logger";
import { ControllerClassParams } from "../../../../../src/abstract/controller";
import { Connection } from "typeorm";
import { orm } from "../../../../../src/thirdPartyService/TypeORMService";
import { ListType, RoomStatus, RoomType } from "../../../../../src/model/room/Constants";
import { Gender, Region, Status } from "../../../../../src/constants/Project";
import { addDays, addHours, addMinutes, startOfDay, subMinutes } from "date-fns/fp";
import { List, ResponseType } from "../../../../../src/v1/controller/room/list";
import { RoomDAO, RoomRecordDAO, RoomUserDAO, UserDAO } from "../../../../../src/dao";
import cryptoRandomString from "crypto-random-string";
import { expect } from "chai";
import { ResponseSuccess } from "../../../../../src/types/Server";

describe("v1 list room", () => {
    let connection: Connection;
    before(async () => {
        connection = await orm();
        await connection.synchronize(true);
    });
    after(() => connection.close());

    const logger = new Logger<any>("test", {}, []);

    const userUUID = v4();

    const createList = (type: string): List => {
        return new List({
            logger,
            req: {
                body: {},
                query: {
                    page: 1,
                },
                params: {
                    type,
                },
                user: {
                    userUUID,
                },
            },
            reply: {},
        } as ControllerClassParams);
    };

    it("list history normal", async () => {
        const fakeRoomsData = new Array(60).fill(1).map((_v, i) => {
            const beginTime = addHours(i + 1)(Date.now());
            return {
                room_uuid: v4(),
                periodic_uuid: "",
                owner_uuid: userUUID,
                title: `test history - ${i}`,
                room_type: RoomType.OneToOne,
                room_status: RoomStatus.Stopped,
                begin_time: beginTime,
                end_time: addMinutes(30)(beginTime),
                whiteboard_room_uuid: v4().replace("-", ""),
                region: Region.SG,
            };
        });
        const fakeRoomUserData = fakeRoomsData.map(room => ({
            room_uuid: room.room_uuid,
            user_uuid: userUUID,
            rtc_uid: cryptoRandomString({ length: 6, type: "numeric" }),
        }));
        const fakeRoomRecordData = fakeRoomsData
            .map(room => ({
                room_uuid: room.room_uuid,
                begin_time: room.begin_time,
                end_time: room.end_time,
            }))
            .splice(20);
        const fakeUserData = {
            user_uuid: userUUID,
            gender: Gender.Man,
            avatar_url: "",
            user_name: "test_user",
            user_password: "",
        };

        await Promise.all([
            RoomDAO().insert(fakeRoomsData),
            RoomUserDAO().insert(fakeRoomUserData),
            UserDAO().insert(fakeUserData),
            RoomRecordDAO().insert(fakeRoomRecordData),
        ]);

        const historyList = createList(ListType.History);

        const result = (await historyList.execute()) as ResponseSuccess<ResponseType>;

        expect(result.status).eq(Status.Success);
        expect(result.data).length(50);

        const hasRecordRooms = result.data
            .filter(room => room.hasRecord)
            .map(room => room.roomUUID)
            .sort();

        expect(fakeRoomRecordData.map(room => room.room_uuid).sort()).deep.eq(hasRecordRooms);
    });

    it("list all normal", async () => {
        await connection.synchronize(true);

        const fakeRoomsData = new Array(30).fill(1).map((_v, i) => {
            const beginTime = addHours(i + 1)(Date.now());
            return {
                room_uuid: v4(),
                periodic_uuid: "",
                owner_uuid: userUUID,
                title: `test all - ${i}`,
                room_type: RoomType.OneToOne,
                room_status:
                    i < 10 ? RoomStatus.Started : i < 20 ? RoomStatus.Idle : RoomStatus.Stopped,
                begin_time: beginTime,
                end_time: addMinutes(30)(beginTime),
                whiteboard_room_uuid: v4().replace("-", ""),
                region: Region.US_SV,
            };
        });
        const fakeRoomUserData = fakeRoomsData.map(room => ({
            room_uuid: room.room_uuid,
            user_uuid: userUUID,
            rtc_uid: cryptoRandomString({ length: 6, type: "numeric" }),
        }));
        const fakeUserData = {
            user_uuid: userUUID,
            gender: Gender.Man,
            avatar_url: "",
            user_name: "test_user_2",
            user_password: "",
        };

        await Promise.all([
            RoomDAO().insert(fakeRoomsData),
            RoomUserDAO().insert(fakeRoomUserData),
            UserDAO().insert(fakeUserData),
        ]);

        const allList = createList(ListType.All);

        const result = (await allList.execute()) as ResponseSuccess<ResponseType>;

        expect(result.status).eq(Status.Success);
        expect(result.data).length(20);
        expect(result.data.filter(room => room.roomStatus === RoomStatus.Idle)).length(10);
    });

    it("list today normal", async () => {
        await connection.synchronize(true);

        const fakeRoomsData = new Array(30).fill(1).map((_v, i) => {
            const beginTime = (() => {
                if (i < 20) {
                    const basicResult = addMinutes((i + 1) * 10)(startOfDay(Date.now()));

                    const timezoneOffset = new Date().getTimezoneOffset();
                    return timezoneOffset < 0
                        ? addMinutes(Math.abs(timezoneOffset))(basicResult)
                        : subMinutes(Math.abs(timezoneOffset))(basicResult);
                }
                return addDays(i)(Date.now());
            })();

            return {
                room_uuid: v4(),
                periodic_uuid: "",
                owner_uuid: i < 15 ? userUUID : v4(),
                title: `test today - ${i}`,
                room_type: RoomType.SmallClass,
                room_status: RoomStatus.Started,
                begin_time: beginTime,
                end_time: addMinutes(30)(beginTime),
                whiteboard_room_uuid: v4().replace("-", ""),
                region: Region.US_SV,
            };
        });
        const fakeRoomUserData = fakeRoomsData.map(room => ({
            room_uuid: room.room_uuid,
            user_uuid: userUUID,
            rtc_uid: cryptoRandomString({ length: 6, type: "numeric" }),
        }));
        const fakeUserData = {
            user_uuid: userUUID,
            gender: Gender.Man,
            avatar_url: "",
            user_name: "test_user_3",
            user_password: "",
        };

        await Promise.all([
            RoomDAO().insert(fakeRoomsData),
            RoomUserDAO().insert(fakeRoomUserData),
            UserDAO().insert(fakeUserData),
        ]);

        const historyList = createList(ListType.Today);

        const result = (await historyList.execute()) as ResponseSuccess<ResponseType>;

        expect(result.status).eq(Status.Success);
        expect(result.data).length(15);
        expect(Array.from(new Set(result.data.map(room => room.ownerUUID)))[0]).eq(
            userUUID,
            "today room list has other user",
        );
    });
});
