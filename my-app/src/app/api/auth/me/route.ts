import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      {
        error: "You are not authorized",
      },
      { status: 401 }
    );
  }
  return NextResponse.json(user);
}
