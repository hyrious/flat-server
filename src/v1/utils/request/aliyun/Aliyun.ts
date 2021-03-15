import { STS, Credentials } from "ali-oss";

const sts = new STS({
    accessKeyId: process.env.ALIBABA_CLOUD_OSS_ACCESS_KEY,
    accessKeySecret: process.env.ALIBABA_CLOUD_OSS_ACCESS_KEY_SECRET,
});

export const aliyunGetSTSToken = async (): Promise<Credentials> => {
    const { credentials } = await sts.assumeRole(
        process.env.ALIBABA_CLOUD_OSS_OSS_ROLE_ARN, // role arn
        process.env.ALIBABA_CLOUD_OSS_POLICY, // policy
        15 * 60, // expiration
        process.env.ALIBABA_CLOUD_OSS_SESSION_NAME, // session name
    );
    return credentials;
};
