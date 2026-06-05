import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, NextRequest } from 'next/server'
 
export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Initialize supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );
    
    // Get logged in user data
    const { data: { user }} = await supabase.auth.getUser();

    // If a user tries to access a page starting with /admin but doesn't have a login session
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the user is already logged in but instead opens the page /login again
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        // Redirect to dashboard page
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return response;
}
 
export const config = {
    matcher: ['/admin/:path*', '/login'],
}