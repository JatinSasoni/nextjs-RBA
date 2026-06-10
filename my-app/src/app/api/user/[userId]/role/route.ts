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
    const currentUser = await getCurrentUser();
    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to perform this operation",
        },
        { status: 401 }
      );
    }

    //prevent user from changing their own role
    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You cannot change your own role",
        },
        { status: 401 }
      );
    }

    const { role } = await request.json();
    const validateRoles = [Role.USER, Role.MANAGER];

    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role or you cannot have more than one Admin role user",
        },
        { status: 404 }
      );
    }

    const { password, ...updatedUser } = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    console.log("Role assignment error");
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
