import { generateToken, hashPassword, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../../prisma/generated/enums";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    //validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email & password are required or not valid",
        },
        {
          status: 400,
        }
      );
    }
    //* Check existing email
    const userFromDB = await prisma.user.findUnique({
      where: {
        email,
      },
      include: { team: true },
    });

    if (!userFromDB) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const isValidPassword = await verifyPassword(userFromDB.password, password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 400,
        }
      );
    }

    const token = generateToken(userFromDB.id);
    const response = NextResponse.json({
      message: "User logged in successfully",
      user: {
        id: userFromDB.id,
        email: userFromDB.email,
        name: userFromDB.email,
        role: userFromDB.role,
        teamId: userFromDB.teamId,
        team: userFromDB.team,
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    console.error("Registration Failed");
    return NextResponse.json(
      {
        error: "Internal server error, Something went wrong!",
      },
      {
        status: 500,
      }
    );
  }
}
