// !! Warning !! Thanks to this file, the route `/api-proxy` is fully claimed. If you attempt
// to direct to there, YOUR REQUEST WILL BE CONSUMED BY THE PROXY MONSTER!

// Special thanks to Blanca Perello for the hint!
// https://www.telerik.com/blogs/dealing-with-cors-in-create-react-app
import { createProxyMiddleware } from "http-proxy-middleware";
import next from "next";

/** Path that is used to reach the backend; string representation of a regex */
const PROXY_PATH = process.env.FOOD_TRUCK_API_PROXY;

/** Actual URL of the backend; if cannot be found, disables rerouting */
const FINAL_PATH = process.env.FOOD_TRUCK_API_URL;

/** Add proxy middleware */
if (PROXY_PATH !== undefined && FINAL_PATH !== undefined) {
  app = next({});
  app.use(
    createProxyMiddleware(PROXY_PATH, {
      target: FINAL_PATH,
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        ["^".concat(PROXY_PATH)]: "",
      },
    })
  );
}
