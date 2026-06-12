import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  await prisma.match.deleteMany();
  await prisma.match.create({
    data: {
      teamA: "Ivory Coast",
      teamB: "Ecuador",
      scheduledAt: new Date("2026-07-01T19:00:00Z"),
      isActive: true,
    },
  });
  console.log("Seeded match: Ivory Coast vs Ecuador");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
