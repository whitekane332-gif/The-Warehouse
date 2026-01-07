export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const image = form.get("image");
  const prompt = form.get("prompt");

  const openaiRes = await fetch(
    "https://api.openai.com/v1/images/edits",
    {
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
    }
  );

  const json = await openaiRes.json();

  return new Response(
    JSON.stringify({
      image: "data:image/png;base64," + json.data[0].b64_json
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
