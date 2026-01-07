export async function onRequestPost({ env }) {
  return new Response(
    JSON.stringify({
      ok: true,
      message: "Function is alive",
      hasKey: !!env.OPENAI_API_KEY,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
