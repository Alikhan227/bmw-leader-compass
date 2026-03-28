const WEBHOOK_URL = "https://timatakky.app.n8n.cloud/webhook-test/b57e4f76-abce-44e4-82bb-150979c13861";

export async function fetchAnalysis(payload: Record<string, unknown> = {}) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed: ${response.status}`);
  }

  return response.json();
}