export default {
  async fetch(request, env, ctx) {
    const apiKey = "Bearer u1xsZstqIFONoPMigChEU0pRr8heiygi";
    const mistralURL = "https://api.mistral.ai/v1/chat/completions";
    let payload = null;

    if (request.method === "POST") {
      payload = await request.text();  // Full body as-is
    } else if (request.method === "GET") {
      const { searchParams } = new URL(request.url);
      const prompt = searchParams.get("prompt");

      if (!prompt) {
        return new Response("Missing prompt parameter", { status: 400 });
      }

      payload = JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }]
      });
    } else {
      return new Response("Only GET and POST supported", { status: 405 });
    }

    const mistralRequest = new Request(mistralURL, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: payload
    });

    const response = await fetch(mistralRequest);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
