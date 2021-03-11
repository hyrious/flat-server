import { createQueryBuilder } from "typeorm";
import { Status } from "../../../../Constants";
import { ErrorCode } from "../../../../ErrorCode";
import { CloudStorageUserDAO } from "../../../dao";
import { CloudStorageFilesModel } from "../../../model/cloudStorage/CloudStorageFiles";
import { CloudStorageUserFilesModel } from "../../../model/cloudStorage/CloudStorageUserFiles";
import { FastifySchema, PatchRequest, Response } from "../../../types/Server";
import { ConvertStep } from "../Constants";

export const list = async (
    req: PatchRequest<{
        Querystring: ListQuery;
    }>,
): Response<ListResponse> => {
    const is_delete = Boolean(req.query.is_delete).toString();

    try {
        const userInfo = await CloudStorageUserDAO().findOne(["total_usage"], {
            user_uuid: req.user.userUUID,
        });

        if (userInfo === undefined) {
            return {
                status: Status.Success,
                data: { totalUsage: "0", files: [] },
            };
        }

        const queryBuilder = createQueryBuilder(CloudStorageUserFilesModel, "fc")
            .addSelect("f.file_uuid", "file_uuid")
            .addSelect("f.file_name", "file_name")
            .addSelect("f.file_size", "file_size")
            .addSelect("f.file_url", "file_url")
            .addSelect("f.file_urls", "file_urls")
            .addSelect("f.convert_step", "convert_step")
            .addSelect("f.task_uuid", "task_uuid")
            .addSelect("f.task_token", "task_token")
            .innerJoin(CloudStorageFilesModel, "f", "fc.file_uuid = c.file_uuid")
            .where(
                `fc.user_uuid = :userUUID
                AND fc.is_delete = :isDelete
                AND f.is_delete = :isDelete`,
                {
                    userUUID: req.user.userUUID,
                    isDelete: is_delete,
                },
            )
            .offset((req.query.page - 1) * 50)
            .limit(50);

        const files = await queryBuilder.getRawMany();

        const resp = files.map((file: File) => {
            return {
                fileUUID: file.file_uuid,
                fileName: file.file_name,
                fileSize: file.file_size,
                fileUrl: file.file_url,
                fileUrls: file.file_urls ? JSON.parse(file.file_urls) : [],
                convertStep: file.convert_step,
                taskUUID: file.task_uuid,
                taskToken: file.task_token,
            };
        });

        return {
            status: Status.Success,
            data: {
                totalUsage: userInfo.total_usage,
                files: resp,
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

interface ListQuery {
    page: number;
    is_delete?: number;
}

export const listSchemaType: FastifySchema<{
    querystring: ListQuery;
}> = {
    querystring: {
        type: "object",
        required: ["page"],
        properties: {
            page: {
                type: "integer",
                maximum: 50,
                minimum: 1,
            },
            is_delete: {
                type: "integer",
                maximum: 1,
                minimum: 0,
                nullable: true,
            },
        },
    },
};

interface ListResponse {
    totalUsage: string;
    files: Array<{
        fileUUID: string;
        fileName: string;
        fileSize: number;
        fileUrl: string;
        fileUrls: string[];
        convertStep: ConvertStep;
        taskUUID: string;
        taskToken: string;
    }>;
}

interface File {
    file_uuid: string;
    file_name: string;
    file_size: number;
    file_url: string;
    file_urls: string;
    convert_step: ConvertStep;
    task_uuid: string;
    task_token: string;
}
