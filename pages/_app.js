import Foot from "@/src/components/c-footer/c-footer";
import Header from "@/src/components/c-header/c-header";
import "@/src/global.scss";
import Layout from "@/src/layout";
import { Sora } from "@next/font/google";
import { useRouter } from "next/router";

import { useEffect } from "react";

// import "normalize.css";

const inter = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

function App({ Component, pageProps }) {
  const router = useRouter();

  const isLoginPage = router.pathname === "/login";
  const is404Page = router.pathname === "/404";

  const showHeader = !isLoginPage && !is404Page;

  return (
    <Layout>
      {showHeader && <Header />}
      <main className={inter.className}>
        <Component {...pageProps} className={inter.className} />
      </main>
      {showHeader && <Foot />}
    </Layout>
  );
}

export default App;
