import { JWTPayload, SignJWT, jwtVerify } from 'jose';

export const createToken = async (email: string) => {
    const token = await new SignJWT({
        email,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1w')
        .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
    return token;

}

export const decodeToken = async (token: string): Promise<JWTPayload & { email: string }> => {
    return (await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET))).payload as JWTPayload & { email: string };
}
