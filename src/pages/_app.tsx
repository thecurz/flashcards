import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
export default function App({ Component, pageProps }: AppProps) {
  const [auth, setAuth] = useState<boolean | null>();
  useEffect(() => {
    //TODO: add security
    if (
      localStorage.getItem("logged") == "true" ||
      sessionStorage.getItem("logged") == "true"
    ) {
      setAuth(true);
      console.log('trueee')
    }
  }, []);
  return <Component {...pageProps} auth={auth} />;
}
