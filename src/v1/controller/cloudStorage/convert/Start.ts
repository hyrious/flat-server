import { Status } from "../../../../Constants";
import { ErrorCode } from "../../../../ErrorCode";
import { createWhiteboardTaskToken } from "../../../../utils/NetlessToken";
import { CloudStorageFilesDAO, CloudStorageUserFilesDAO } from "../../../dao";
import { FastifySchema, PatchRequest, Response } from "../../../types/Server";
import { whiteboardCreateConversionTask } from "../../../utils/request/whiteboard/Whiteboard";
import { ConvertStep } from "../Constants";
import { isConverted, determineType } from "./Utils";

export const convertStart = async (
    req: PatchRequest<{ Body: ConvertStartBody }>,
): Response<ConvertStartResponse> => {
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

        const fileInfo = await CloudStorageFilesDAO().findOne(["file_url", "convert_step"], {
            file_uuid: fileUUID,
        });

        if (fileInfo === undefined || fileInfo.file_url === "") {
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
        const result = await whiteboardCreateConversionTask({ resource, type });

        const taskUUID = result.data.uuid;
        const taskToken = createWhiteboardTaskToken(taskUUID);
        await CloudStorageFilesDAO().update(
            {
                task_uuid: taskUUID,
                task_token: taskToken,
                convert_step: ConvertStep.Converting,
            },
            { file_uuid: fileUUID },
        );

        return {
            status: Status.Success,
            data: {
                taskUUID,
                taskToken,
            },
        };
    } catch (e) {
        console.error(e);
        return {
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        };
    }
};

interface ConvertStartBody {
    fileUUID: string;
}

export const convertStartSchemaType: FastifySchema<{
    body: ConvertStartBody;
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

interface ConvertStartResponse {
    taskUUID: string;
    taskToken: string;
}
