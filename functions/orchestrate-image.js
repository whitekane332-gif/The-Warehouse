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

    // ⚠️ 这里的 KEY 来自 Cloudflare 环境变量
    const API_KEY = env.OPENAI_API_KEY;

    // ===== V0：先 mock（确保链路通）=====
    const mockResult = {
      api,
      prompt,
      imageName: image.name,
      output: "This is a mock AI result from Cloudflare Pages Function"
    };

    return new Response(
      JSON.stringify(mockResult, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
