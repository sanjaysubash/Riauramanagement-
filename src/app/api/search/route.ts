import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ people: [], projects: [], tasks: [] });

  const [people, projects, tasks] = await Promise.all([
    prisma.employee.findMany({
      where: { status: { not: "inactive" }, OR: [{ name: { contains: q } }, { title: { contains: q } }, { email: { contains: q } }] },
      take: 5,
      select: { id: true, name: true, title: true, avatarInitials: true, avatarColor: true },
    }),
    prisma.project.findMany({
      where: { name: { contains: q } },
      take: 5,
      select: { id: true, name: true, status: true },
    }),
    prisma.task.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, status: true, priority: true },
    }),
  ]);

  return NextResponse.json({
    people: people.map((p) => ({ id: p.id, name: p.name, title: p.title, avatar: p.avatarInitials, avatarColor: p.avatarColor })),
    projects: projects.map((p) => ({ id: p.id, name: p.name, status: p.status })),
    tasks: tasks.map((t) => ({ id: t.id, title: t.title, status: t.status, priority: t.priority })),
  });
}
