export async function onRequestPost({ request, env }) {
  const { prompt } = await request.json();

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt,
      size: "512x512",
    }),
  });

  const data = await res.json();

  return new Response(
    JSON.stringify({
      ok: true,
      image: data.data[0].url,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
