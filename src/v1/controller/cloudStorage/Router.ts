import { FastifyRoutes } from "../../types/Server";
import { deleteFile, deleteFileSchemaType } from "./delete";
import { list, listSchemaType } from "./list";

export const httpCloudStorage: Readonly<FastifyRoutes[]> = Object.freeze([
    Object.freeze({
        method: "post",
        path: "cloud-storage/list",
        handler: list,
        auth: true,
        schema: listSchemaType,
    }),
    Object.freeze({
        method: "post",
        path: "cloud-storage/delete",
        handler: deleteFile,
        auth: true,
        schema: deleteFileSchemaType,
    }),
]);
