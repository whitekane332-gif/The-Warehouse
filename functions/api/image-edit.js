export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const image = form.get("image");
  const prompt = form.get("prompt");

  if (!image || !prompt) {
    return new Response(
      JSON.stringify({ error: "missing image or prompt" }),
      { status: 400 }
    );
  }

  // 转 base64
  const buffer = await image.arrayBuffer();
  const base64Image = btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  );

  // === 调用 OpenAI Images API ===
  const resp = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`
    },
    body: (() => {
      const fd = new FormData();
      fd.append("model", "gpt-image-1");
      fd.append("image", image);
      fd.append("prompt", prompt);
      return fd;
    })()
  });

  const data = await resp.json();

  return new Response(
    JSON.stringify({
      image: `data:image/png;base64,${data.data[0].b64_json}`
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
