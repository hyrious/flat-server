import { getConnection } from "typeorm";
import { Status } from "../../../../Constants";
import { ErrorCode } from "../../../../ErrorCode";
import { CloudStorageFilesDAO, CloudStorageUserDAO, CloudStorageUserFilesDAO } from "../../../dao";
import { FastifySchema, PatchRequest, Response } from "../../../types/Server";

export const deleteFile = async (
    req: PatchRequest<{ Body: DeleteFileBody }>,
): Response<DeleteFileResponse> => {
    const { fileUUID, force } = req.body;
    const { userUUID } = req.user;

    try {
        const userInfo = await CloudStorageUserDAO().findOne(["total_usage"], {
            user_uuid: userUUID,
        });

        if (userInfo === undefined) {
            return {
                status: Status.Failed,
                code: ErrorCode.UserNotFound,
            };
        }

        const userFileInfo = await CloudStorageUserFilesDAO().findOne([], {
            file_uuid: fileUUID,
            user_uuid: userUUID,
        });

        if (userFileInfo === undefined) {
            return {
                status: Status.Failed,
                code: ErrorCode.FileNotFound,
            };
        }

        const fileInfo = await CloudStorageFilesDAO().findOne(["file_size"], {
            file_uuid: fileUUID,
        });

        if (fileInfo === undefined) {
            return {
                status: Status.Failed,
                code: ErrorCode.FileNotFound,
            };
        }

        const totalUsage = Number(userInfo.total_usage) - fileInfo.file_size;

        await getConnection().transaction(async t => {
            const commands: Promise<unknown>[] = [];

            if (force) {
                // TODO: tell oss to really delete files

                commands.push(
                    CloudStorageUserDAO(t).update(
                        {
                            total_usage: totalUsage.toString(),
                        },
                        {
                            user_uuid: userUUID,
                        },
                    ),
                );

                commands.push(
                    CloudStorageUserFilesDAO(t).remove({
                        file_uuid: fileUUID,
                        user_uuid: userUUID,
                    }),
                );

                commands.push(
                    CloudStorageFilesDAO(t).remove({
                        file_uuid: fileUUID,
                    }),
                );
            } else {
                commands.push(
                    CloudStorageUserFilesDAO(t).update(
                        {
                            is_delete: true,
                        },
                        {
                            file_uuid: fileUUID,
                            user_uuid: userUUID,
                        },
                    ),
                );

                commands.push(
                    CloudStorageFilesDAO(t).update(
                        {
                            is_delete: true,
                        },
                        {
                            file_uuid: fileUUID,
                        },
                    ),
                );
            }

            await Promise.all(commands);
        });

        return {
            status: Status.Success,
            data: {},
        };
    } catch (e) {
        console.error(e);
        return {
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        };
    }
};

interface DeleteFileBody {
    fileUUID: string;
    force?: boolean;
}

export const deleteFileSchemaType: FastifySchema<{
    body: DeleteFileBody;
}> = {
    body: {
        type: "object",
        required: ["fileUUID"],
        properties: {
            fileUUID: {
                type: "string",
                format: "uuid-v4",
            },
            force: {
                type: "boolean",
                nullable: true,
            },
        },
    },
};

interface DeleteFileResponse {}
