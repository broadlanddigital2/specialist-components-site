// Runs only when no static file matches the request path exactly.
// Maps clean URLs (/about-us, /news/news-1, /about-us/) to their .html files,
// and falls back to public/404.html.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Drop a trailing slash (except the root) so /about-us/ and /about-us both work.
    if (path.length > 1 && path.endsWith("/")) {
      url.pathname = path.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // Homepage.
    if (path === "/") {
      return env.ASSETS.fetch(new URL("/index.html", url));
    }

    // Clean URLs: /about-us -> /about-us.html, then /about-us/index.html.
    if (!path.split("/").pop().includes(".")) {
      for (const candidate of [`${path}.html`, `${path}/index.html`]) {
        const res = await env.ASSETS.fetch(new URL(candidate, url));
        if (res.ok) return res;
      }
    }

    const notFound = await env.ASSETS.fetch(new URL("/404.html", url));
    return new Response(notFound.body, {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
