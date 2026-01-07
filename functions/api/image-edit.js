export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");

    const openaiResp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      }),
    });

    const rawText = await openaiResp.text();

    return new Response(
      JSON.stringify({
        ok: openaiResp.ok,
        status: openaiResp.status,
        openai_raw: rawText,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        fatal: true,
        message: err.message,
        stack: err.stack,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
