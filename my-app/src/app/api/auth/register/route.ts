import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../../prisma/generated/enums";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, teamCode } = await request.json();

    //validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          error: "Name, email & password are required or not valid",
        },
        {
          status: 400,
        }
      );
    }
    //* Check existing email
    const doesExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (doesExists) {
      return NextResponse.json(
        {
          error: "User already exist!",
        },
        {
          status: 400,
        }
      );
    }

    let teamId: string | undefined;

    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: {
          code: teamCode,
        },
      });
      if (!team) {
        return NextResponse.json(
          {
            error: "Please enter a valid team code",
          },
          {
            status: 400,
          }
        );
      }
      teamId = team.id;
    }

    const hashedPassword = await hashPassword(password);

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        teamId,
      },
      include: {
        team: true,
      },
    });

    const token = generateToken(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.email,
        role: user.role,
        teamId: user.teamId,
        team: user.team,
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
