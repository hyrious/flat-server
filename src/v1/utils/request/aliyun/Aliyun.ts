import { STS, Credentials } from "ali-oss";

const sts = new STS({
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
});

// https://juejin.cn/post/6844903991806197767
export const aliyunGetSTSToken = async (): Promise<Credentials> => {
    const { credentials } = await sts.assumeRole(
        "role arn", // get it from ram
        undefined, // policy
        15 * 60, // expiration seconds
        "web-client", // session name
    );
    return credentials;
};
