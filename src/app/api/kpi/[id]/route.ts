import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isHrAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isHrAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number((await params).id);
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name;
  if (body.unit !== undefined) data.unit = body.unit;
  if (body.period !== undefined) data.period = body.period;
  if (body.trend === "up" || body.trend === "down") data.trend = body.trend;
  if (body.current !== undefined) {
    const current = Number(body.current);
    if (!Number.isFinite(current)) return NextResponse.json({ error: "Current must be a valid number." }, { status: 400 });
    data.current = current;
  }
  if (body.target !== undefined) {
    const target = Number(body.target);
    if (!Number.isFinite(target)) return NextResponse.json({ error: "Target must be a valid number." }, { status: 400 });
    data.target = target;
  }

  const kpi = await prisma.kPI.update({ where: { id }, data });
  await logAudit(user, `Updated KPI "${kpi.name}"`, "KPI");

  return NextResponse.json({ kpi: { id: kpi.id, name: kpi.name } });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isHrAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number((await params).id);
  const kpi = await prisma.kPI.delete({ where: { id } });
  await logAudit(user, `Deleted KPI "${kpi.name}"`, "KPI", "warning");

  return NextResponse.json({ ok: true });
}
