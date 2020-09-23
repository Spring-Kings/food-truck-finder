// !! Warning !! Thanks to this file, the route /api-proxy is fully claimed. If you attempt
// to direct to there, YOUR REQUEST WILL BE CONSUMED BY THE PROXY MONSTER!

// Special thanks to Blanca Perello for the hint!
// https://www.telerik.com/blogs/dealing-with-cors-in-create-react-app
import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} from "http-proxy-middleware";

/** Path that is used to reach the backend; string representation of a regex */
const PROXY_PATH: string | undefined = process.env.FOOD_TRUCK_API_PROXY;

/** Actual URL of the backend; if cannot be found, disables rerouting */
const FINAL_PATH: string | undefined = process.env.FOOD_TRUCK_API_URL;

/** Proxy middleware */
const PROXY: RequestHandler | null =
  PROXY_PATH != undefined && FINAL_PATH != undefined
    ? createProxyMiddleware(PROXY_PATH, {
        changeOrigin: true,
        target: FINAL_PATH,
        pathRewrite: {
          ["^".concat(PROXY_PATH)]: "",
        }
      })
    : null;

// Apply the proxy, if possible
module.exports = function (app: any) {
  if (PROXY != null) app.use(PROXY);
};
