import { NextRequest, NextResponse } from "next/server";

type LeadPayload = {
  name: string;
  phone: string;
  source: string;
  direction?: string;
  master?: string;
  location?: string;
  program?: string;
  people?: number;
  addons?: string[];
  interest?: string;
  message?: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: LeadPayload = await req.json();

    if (!data.name || !data.phone) {
      return NextResponse.json(
        { ok: false, error: "name и phone обязательны" },
        { status: 400 },
      );
    }

    if (!data.source) {
      return NextResponse.json(
        { ok: false, error: "source обязательно" },
        { status: 400 },
      );
    }

    const enriched = {
      ...data,
      receivedAt: new Date().toISOString(),
      ua: req.headers.get("user-agent") ?? undefined,
      referrer: req.headers.get("referer") ?? undefined,
    };

    // TODO (issue #12): отправка в Telegram-бот / email / база
    console.log("[lead]", JSON.stringify(enriched, null, 2));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] error:", err);
    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
