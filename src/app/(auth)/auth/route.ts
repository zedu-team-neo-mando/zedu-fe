import { NextResponse, type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const signUpUrl = request.nextUrl.clone();
  signUpUrl.pathname = "/auth/sign-up";

  return NextResponse.redirect(signUpUrl);
}
