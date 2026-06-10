import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import { Role } from "./generated/client";
import { hashPassword } from "../src/app/lib/auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
export async function Main() {
  console.log("Starting Database Seeding...");

  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "engineering",
        description: "Software Development Team",
        code: "ENG-2024",
      },
    }),
    prisma.team.create({
      data: {
        name: "Mechanical",
        description: "Godrej Power",
        code: "GDR-2024",
      },
    }),
    prisma.team.create({
      data: {
        name: "Marketing",
        description: "Marketing  Team",
        code: "MK-2024",
      },
    }),
  ]);
  const sampleUsers = [
    // Admins
    {
      name: "Super Jatin",
      email: "jatin@gmail.com",
      teamId: teams[0].id,
      role: Role.USER,
    },

    // Engineering Team
    {
      name: "John Developer",
      email: "john@gmail.com",
      teamId: teams[0].id,
      role: Role.MANAGER,
    },
    {
      name: "Alice Johnson",
      email: "alice@gmail.com",
      teamId: teams[0].id,
      role: Role.USER,
    },
    {
      name: "Bob Williams",
      email: "bob@gmail.com",
      teamId: teams[0].id,
      role: Role.USER,
    },

    // Mechanical Team
    {
      name: "Michael Sharma",
      email: "michael@gmail.com",
      teamId: teams[1].id,
      role: Role.MANAGER,
    },
    {
      name: "Rahul Verma",
      email: "rahul@gmail.com",
      teamId: teams[1].id,
      role: Role.USER,
    },
    {
      name: "Priya Singh",
      email: "priya@gmail.com",
      teamId: teams[1].id,
      role: Role.USER,
    },

    // Marketing Team
    {
      name: "Sarah Marketing",
      email: "sarah@gmail.com",
      teamId: teams[2].id,
      role: Role.MANAGER,
    },
    {
      name: "Emily Brown",
      email: "emily@gmail.com",
      teamId: teams[2].id,
      role: Role.USER,
    },
    {
      name: "David Wilson",
      email: "david@gmail.com",
      teamId: teams[2].id,
      role: Role.GUEST,
    },
  ];

  const password = await hashPassword("12345");
  console.log(password);

  for (const userData of sampleUsers) {
    await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password,
        role: userData.role,
        teamId: userData.teamId,
      },
    });
  }
}

Main()
  .then(() => console.log("Seeding successfull"))
  .catch((error) => console.log("Seeding Failed", error))
  .finally(async () => {
    await prisma.$disconnect();
  });
