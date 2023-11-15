import { type AppType } from "next/app";
import "regenerator-runtime/runtime";

import { api } from "~/utils/api";

import "@total-typescript/ts-reset";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
