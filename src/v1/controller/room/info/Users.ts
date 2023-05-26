import { FastifySchema, Response, ResponseError } from "../../../../types/Server";
import { Status } from "../../../../constants/Project";
import { ErrorCode } from "../../../../ErrorCode";
import { RoomUserDAO } from "../../../../dao";
import { RoomUserModel } from "../../../../model/room/RoomUser";
import { UserModel } from "../../../../model/user/User";
import { Controller } from "../../../../decorator/Controller";
import { AbstractController } from "../../../../abstract/controller";
import { dataSource } from "../../../../thirdPartyService/TypeORMService";
import RedisService from "../../../../thirdPartyService/RedisService";
import { RedisKey } from "../../../../utils/Redis";
import { parseError } from "../../../../logger";

@Controller<RequestType, ResponseType>({
    method: "post",
    path: "room/info/users",
    auth: true,
})
export class UserInfo extends AbstractController<RequestType, ResponseType> {
    public static readonly schema: FastifySchema<RequestType> = {
        body: {
            type: "object",
            required: ["roomUUID"],
            properties: {
                roomUUID: {
                    type: "string",
                    format: "uuid-v4",
                },
                usersUUID: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid-v4",
                    },
                    minItems: 1,
                    nullable: true,
                },
            },
        },
    };

    public async execute(): Promise<Response<ResponseType>> {
        const { roomUUID, usersUUID } = this.body;

        // Cache one user info.
        if (usersUUID && usersUUID.length === 1) {
            try {
                const cachedInfo = await RedisService.get(
                    RedisKey.roomUserInfo(roomUUID, usersUUID[0]),
                );

                if (cachedInfo) {
                    return {
                        status: Status.Success,
                        data: JSON.parse(cachedInfo),
                    };
                }
            } catch (error) {
                this.logger.error("get user info from cache failed", parseError(error));
            }
        }

        const result = await this.fetchUsersInfo(roomUUID, usersUUID);

        if (result.status === Status.Success) {
            const record: [string, string][] = [];
            for (const userUUID in result.data) {
                const userInfo = result.data[userUUID];
                const data = { [userUUID]: userInfo };
                record.push([RedisKey.roomUserInfo(roomUUID, userUUID), JSON.stringify(data)]);
            }
            try {
                const oneDay = 60 * 60 * 24;
                await RedisService.mset(record, oneDay);
            } catch (error) {
                this.logger.error("cache user info failed", parseError(error));
            }
        }

        return result;
    }

    private async fetchUsersInfo(
        roomUUID: string,
        usersUUID: string[] | undefined,
    ): Promise<Response<ResponseType>> {
        const userUUID = this.userUUID;

        const roomUserInfo = await RoomUserDAO().findOne(["id"], {
            user_uuid: userUUID,
            room_uuid: roomUUID,
        });

        if (roomUserInfo === undefined) {
            return {
                status: Status.Failed,
                code: ErrorCode.RoomNotFound,
            };
        }

        const roomUsersInfoBasic = dataSource
            .createQueryBuilder(RoomUserModel, "ru")
            .addSelect("ru.rtc_uid", "rtc_uid")
            .addSelect("ru.user_uuid", "user_uuid")
            .addSelect("u.user_name", "user_name")
            .addSelect("u.avatar_url", "avatar_url")
            .innerJoin(UserModel, "u", "ru.user_uuid = u.user_uuid")
            .andWhere("room_uuid = :roomUUID", {
                roomUUID,
            })
            .andWhere("ru.is_delete = false")
            .andWhere("u.is_delete = false");

        if (usersUUID) {
            roomUsersInfoBasic.andWhere("ru.user_uuid IN (:...usersUUID)", {
                usersUUID,
            });
        }

        const roomUsersInfo = await roomUsersInfoBasic.getRawMany<RoomUsersInfo>();

        if (roomUsersInfo.length === 0) {
            return {
                status: Status.Failed,
                code: ErrorCode.UserNotFound,
            };
        }

        const result: ResponseType = {};
        for (const { user_name, user_uuid, rtc_uid, avatar_url } of roomUsersInfo) {
            result[user_uuid] = {
                name: user_name,
                rtcUID: Number(rtc_uid),
                avatarURL: avatar_url,
            };
        }

        return {
            status: Status.Success,
            data: result,
        };
    }

    public errorHandler(error: Error): ResponseError {
        return this.autoHandlerError(error);
    }
}

interface RequestType {
    body: {
        roomUUID: string;
        usersUUID?: string[];
    };
}

type ResponseType = {
    [key in string]: {
        name: string;
        rtcUID: number;
        avatarURL: string;
    };
};

type RoomUsersInfo = Pick<RoomUserModel, "rtc_uid" | "user_uuid"> &
    Pick<UserModel, "user_name" | "avatar_url">;
