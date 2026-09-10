const courses = [
  { id: "beginner", title: "はじめての千歌", level: "入門" },
  { id: "practice", title: "実践ワークショップ", level: "初級" },
  { id: "advanced", title: "表現を深める", level: "中級" }
];

const events = [
  { id: "spring-session", title: "春の公開セッション", date: "2026-04-18", venue: "オンライン" },
  { id: "summer-workshop", title: "夏の集中ワークショップ", date: "2026-07-11", venue: "東京" }
];

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      "cache-control": "no-store"
    }
  });
}

function allowedOrigin(request, env) {
  const configured = env.ALLOWED_ORIGIN || "*";
  const requestOrigin = request.headers.get("Origin");
  if (configured === "*" || !requestOrigin || requestOrigin === configured) return configured === "*" ? "*" : requestOrigin;
  return null;
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    if (request.method === "OPTIONS") {
      return origin ? new Response(null, { status: 204, headers: { "access-control-allow-origin": origin, "access-control-allow-methods": "GET, OPTIONS", "access-control-allow-headers": "Content-Type" } }) : new Response("Forbidden", { status: 403 });
    }
    if (!origin) return json({ error: "Origin is not allowed" }, 403, "null");
    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405, origin);

    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/api") return json({ service: "senka-api", status: "ok" }, 200, origin);
    if (url.pathname === "/api/course") return json({ courses }, 200, origin);
    if (url.pathname === "/api/events") return json({ events }, 200, origin);
    if (url.pathname === "/api/hello") {
      const name = url.searchParams.get("name")?.trim();
      if (!name) return json({ error: "name is required" }, 400, origin);
      return json({ message: `こんにちは、${name}さん。` }, 200, origin);
    }
    if (url.pathname === "/api/fortune") return json({ fortune: "大吉", message: "小さな一歩が、よい流れをつくります。" }, 200, origin);
    return json({ error: "Not found" }, 404, origin);
  }
};