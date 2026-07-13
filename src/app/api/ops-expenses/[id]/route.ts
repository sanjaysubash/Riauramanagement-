import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canSubmitOpsExpense } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

type Params = { params: Promise<{ id: string }> };

const PAYMENT_MODES = ["cash", "online", "cheque"];

function canModify(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>, entry: { employeeId: number }) {
  return user.role === "super_admin" || (canSubmitOpsExpense(user) && entry.employeeId === user.id);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number((await params).id);
  const entry = await prisma.opsExpense.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canModify(user, entry)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const payeeName = body?.payeeName?.trim();
  const reason = body?.reason?.trim();
  const description = body?.description?.trim() || null;
  const paymentMode = body?.paymentMode;
  const date = body?.date ? new Date(body.date) : null;
  const amount = Math.round(Number(body?.amount));
  const screenshotUrl = body?.screenshotUrl?.trim() || null;

  if (!payeeName) return NextResponse.json({ error: "A payee name is required." }, { status: 400 });
  if (!reason) return NextResponse.json({ error: "A reason for payment is required." }, { status: 400 });
  if (!PAYMENT_MODES.includes(paymentMode)) {
    return NextResponse.json({ error: "Invalid payment mode." }, { status: 400 });
  }
  if (!date || isNaN(date.getTime())) {
    return NextResponse.json({ error: "A valid date is required." }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });
  }
  if (paymentMode === "online" && !screenshotUrl) {
    return NextResponse.json({ error: "A payment screenshot is required for online payments." }, { status: 400 });
  }
  if (paymentMode !== "online" && screenshotUrl) {
    return NextResponse.json({ error: "A screenshot is only accepted for online payments." }, { status: 400 });
  }

  await prisma.opsExpense.update({
    where: { id },
    data: { payeeName, reason, description, paymentMode, date, amount, screenshotUrl },
  });
  await logAudit(user, `Edited expense entry for "${payeeName}" (₹${amount})`, "Ops Expenses", "info");

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number((await params).id);
  const entry = await prisma.opsExpense.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canModify(user, entry)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.opsExpense.delete({ where: { id } });
  await logAudit(user, `Deleted expense entry for "${entry.payeeName}" (₹${entry.amount})`, "Ops Expenses", "warning");

  return NextResponse.json({ ok: true });
}
