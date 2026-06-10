import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../prisma/generated/client";
import { Role } from "@/app/types";
import { prisma } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          message: "You are unauthorized to perform this operation",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const teamId = searchParams.get("teamId");

    const where: Prisma.UserWhereInput = {};
    if (user.role === Role.ADMIN) {
      //admin can see all users
    } else if (user.role === Role.MANAGER) {
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    if (teamId) {
      where.teamId = teamId;
    }

    if (role && Object.values(Role).includes(role as Role)) {
      where.role = role as Role;
    }


    const allUsers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ allUsers });
  } catch (error) {
    console.error("Error while getting users info");
    return NextResponse.json(
      {
        error: "Internal Server Error, something went wrong!",
      },
      { status: 500 }
    );
  }
}
