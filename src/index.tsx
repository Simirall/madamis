import { Hono } from "hono";
import { renderToString } from "react-dom/server";
import { api } from "./api";

const app = new Hono();

app.route("/api", api).get("*", (c) => {
  return c.html(
    renderToString(
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta content="light dark" name="color-scheme" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>j∞マダミス部</title>
          <style>{`
            :root {
              color-scheme: light dark;
              accent-color: #16a34a;
            }
          `}</style>
          <link
            href="/static/icon.svg"
            rel="shortcut icon"
            type="image/svg+xml"
          />
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link href="https://fonts.gstatic.com" rel="preconnect" />
          <link
            href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap"
            rel="stylesheet"
          ></link>
          {import.meta.env.PROD ? (
            <script src="/static/client.js" type="module"></script>
          ) : (
            <script src="/src/client.tsx" type="module"></script>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>,
    ),
  );
});

export default app;
