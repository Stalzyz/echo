import { NextResponse } from "next/server"

export default function middleware(req: any) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

