import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (token && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && pathname.startsWith("/dashboard")) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/auth/login", 
  ],
};
