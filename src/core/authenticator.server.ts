import { JWTPayload, SignJWT, jwtVerify } from 'jose';

type Deps = {
    authSecret: string;
};
export const createAuthenticator = ({ authSecret }: Deps) => {
    const createToken = async (email: string) => {
        const token = await new SignJWT({
            email,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1w')
            .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
        return token;
    };

    const decodeToken = async (token: string): Promise<JWTPayload & { email: string }> => {
        return (await jwtVerify(token, new TextEncoder().encode(authSecret))).payload as JWTPayload & {
            email: string;
        };
    };

    return {
        createToken,
        decodeToken,
    };
};
