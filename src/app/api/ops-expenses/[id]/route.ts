import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "super_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number((await params).id);
  const entry = await prisma.opsExpense.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.opsExpense.delete({ where: { id } });
  await logAudit(user, `Deleted expense entry for "${entry.payeeName}" (₹${entry.amount})`, "Ops Expenses", "warning");

  return NextResponse.json({ ok: true });
}
