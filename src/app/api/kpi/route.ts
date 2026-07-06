import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isHrAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kpis = await prisma.kPI.findMany({ include: { department: true }, orderBy: { id: "asc" } });

  return NextResponse.json({
    kpis: kpis.map((k) => ({
      id: k.id,
      name: k.name,
      dept: k.department?.name ?? "",
      current: k.current,
      target: k.target,
      unit: k.unit,
      pct: k.target ? Math.round(Math.min(100, (k.current / k.target) * 100)) : 0,
      trend: k.trend,
      period: k.period,
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isHrAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const name = body?.name?.trim();
  if (!name) return NextResponse.json({ error: "KPI name is required." }, { status: 400 });

  const current = Number(body?.current);
  const target = Number(body?.target);
  if (!Number.isFinite(current) || !Number.isFinite(target)) {
    return NextResponse.json({ error: "Current and target must be valid numbers." }, { status: 400 });
  }

  const department = body?.dept ? await prisma.department.findUnique({ where: { name: body.dept } }) : null;

  const kpi = await prisma.kPI.create({
    data: {
      name,
      departmentId: department?.id ?? null,
      current,
      target,
      unit: body?.unit || "",
      trend: body?.trend === "down" ? "down" : "up",
      period: body?.period || "",
    },
  });

  await logAudit(user, `Created KPI "${kpi.name}"`, "KPI");

  return NextResponse.json({ kpi: { id: kpi.id, name: kpi.name } }, { status: 201 });
}
