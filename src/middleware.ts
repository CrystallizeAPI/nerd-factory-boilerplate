import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAuthenticator } from './core/authenticator.server';

export async function middleware(request: NextRequest) {
    const redirectTo = (to: string) =>
        NextResponse.redirect(new URL(request.nextUrl.href.replace(request.nextUrl.pathname, to)));

    const cookie = request.cookies.get('auth.token');
    if (!cookie) {
        return redirectTo('/login');
    }
    const token = cookie.value;
    try {
        const authenticator = createAuthenticator({
            authSecret: `${process.env.AUTH_SECRET}`,
        });
        // we don't have to do anything with the payload here
        // we just verify that the token is valid
        await authenticator.decodeToken(token);
    } catch {
        return redirectTo('/login');
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/my/subscriptions'],
};
