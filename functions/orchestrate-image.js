export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");
    const prompt = formData.get("prompt");
    const api = formData.get("api");

    if (!image || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing image or prompt" }),
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not set" }),
        { status: 500 }
      );
    }

    // 把图片转成 base64
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // === OpenAI Vision (GPT-4o) ===
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${image.type};base64,${base64Image}`
                }
              }
            ]
          }
        ]
      })
    });

    const result = await response.json();

    return new Response(
      JSON.stringify(
        {
          api,
          prompt,
          imageName: image.name,
          result: result.choices?.[0]?.message?.content || "No result"
        },
        null,
        2
      ),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
