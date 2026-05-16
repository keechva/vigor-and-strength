export type LeadData = {
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

export async function sendLead(
  data: LeadData,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = (await res.json()) as { ok?: boolean; error?: string };

    if (!res.ok) {
      return { ok: false, error: json.error ?? "Ошибка отправки" };
    }

    return { ok: true };
  } catch (err) {
    console.error("sendLead error:", err);
    return { ok: false, error: "Не удалось отправить заявку" };
  }
}
