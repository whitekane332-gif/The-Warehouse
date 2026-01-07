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

    const API_KEY = env.GEMINI_API_KEY;

    // 1️⃣ 把图片转成 base64
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // 2️⃣ 构造 Gemini 请求体
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: image.type,
                data: base64Image
              }
            }
          ]
        }
      ]
    };

    // 3️⃣ 调用 Gemini Nano Banana
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const result = await resp.json();

    return new Response(
      JSON.stringify(result, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
