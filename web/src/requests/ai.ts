const apiUrl = window?._env_?.API_URL;

export async function aiStreamRequest(
  prompt: string,
  onMessage: (chunk: string) => void
) {
  const response = await fetch(`${apiUrl}/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "primo-ia",
      prompt,
      stream: true,
    }),
  });

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onMessage(chunk);
  }
}