import { FastifyRoutes } from "../../types/Server";
import { list, listSchemaType } from "./list";

export const httpCloudStorage: Readonly<FastifyRoutes[]> = Object.freeze([
    Object.freeze({
        method: "post",
        path: "cloud-storage/list",
        handler: list,
        auth: true,
        schema: listSchemaType,
    }),
]);
