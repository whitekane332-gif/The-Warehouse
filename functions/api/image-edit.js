export async function onRequestPost({ request, env }) {
  try {
    const { prompt } = await request.json();

    const res = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: "512x512",
        }),
      }
    );

    // 👇 关键：兜底 OpenAI 错误
    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({
          ok: false,
          source: "openai",
          status: res.status,
          detail: text,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({
        ok: true,
        image: data.data[0].url,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        source: "function",
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
