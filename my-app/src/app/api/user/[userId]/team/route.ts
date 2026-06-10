import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextResponse } from "next/server";

export async function PATCH(
  request: NextResponse,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const user = await getCurrentUser();
    if (!user || !checkUserPermission(user, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to perform this operation",
        },
        { status: 401 }
      );
    }
    const { teamId } = await request.json();
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
      });
      if (!team) {
        return NextResponse.json(
          {
            error: "Team not found",
          },
          { status: 400 }
        );
      }
    }

    const { password, ...updatedUser } = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        teamId,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: teamId
        ? "User assigned to team successfully"
        : "User removed from team successfully",
    });
  } catch (error) {
    console.log("Error while assigning/remove team");
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal Server Error, Something went off",
      },
      { status: 500 }
    );
  }
}
