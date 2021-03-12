import { Status } from "../../../../Constants";
import { ErrorCode } from "../../../../ErrorCode";
import { CloudStorageFilesDAO, CloudStorageUserFilesDAO } from "../../../dao";
import { FastifySchema, PatchRequest, Response } from "../../../types/Server";
import { whiteboardQueryConversionTask } from "../../../utils/request/whiteboard/Whiteboard";
import { ConvertStep } from "../Constants";
import { determineType, isConverted } from "./Utils";

export const convertFinish = async (
    req: PatchRequest<{ Body: ConvertFinishBody }>,
): Response<ConvertFinishResponse> => {
    const { fileUUID } = req.body;
    const { userUUID } = req.user;

    try {
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

        const fileInfo = await CloudStorageFilesDAO().findOne(
            ["file_name", "file_url", "convert_step", "task_token", "task_uuid"],
            {
                file_uuid: fileUUID,
            },
        );

        if (fileInfo === undefined) {
            return {
                status: Status.Failed,
                code: ErrorCode.FileNotFound,
            };
        }

        if (isConverted(fileInfo.convert_step)) {
            return {
                status: Status.Failed,
                code: ErrorCode.AlreadyConverted,
            };
        }

        const resource = fileInfo.file_url;
        const type = determineType(resource);
        const result = await whiteboardQueryConversionTask(fileUUID, type);
        const status = result.data.status;

        if (status === "Finished") {
            await CloudStorageFilesDAO().update(
                {
                    convert_result: result.data.progress.convertedFileList.map(
                        file => file.conversionFileUrl,
                    ),
                    convert_step: ConvertStep.Done,
                },
                {
                    file_uuid: fileUUID,
                },
            );

            return {
                status: Status.Success,
                data: {},
            };
        }

        if (status === "Waiting" || status === "Converting") {
            return {
                status: Status.Failed,
                code: ErrorCode.StillConverting,
            };
        }

        if (status === "Fail") {
            await CloudStorageFilesDAO().update(
                {
                    convert_step: ConvertStep.Failed,
                },
                {
                    file_uuid: fileUUID,
                },
            );

            return {
                status: Status.Failed,
                code: ErrorCode.ConvertFailed,
            };
        }

        return {
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        };
    } catch (e) {
        console.error(e);
        return {
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        };
    }
};

interface ConvertFinishBody {
    fileUUID: string;
}

export const convertFinishSchemaType: FastifySchema<{
    body: ConvertFinishBody;
}> = {
    body: {
        type: "object",
        required: ["fileUUID"],
        properties: {
            fileUUID: {
                type: "string",
                format: "uuid-v4",
            },
        },
    },
};

interface ConvertFinishResponse {}
