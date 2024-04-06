import { Sora } from "@next/font/google";
import { MainProvider } from "@/src/contexts/Main-context";
import "normalize.css";
import "@/src/global.scss";
import Layout from "@/src/layout";
import Header from "@/src/components/c-header/c-header";
import { useRouter } from "next/router";
import Foot from "@/src/components/c-footer/c-footer";

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
