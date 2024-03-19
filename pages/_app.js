import { Sora } from "@next/font/google";
import { MainProvider } from "@/src/contexts/Main-context";
import "@/src/global.scss";
import Layout from "@/src/layout";

const inter = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

function App({ Component, pageProps }) {
  return (
    <Layout>
   
        <MainProvider globalData={pageProps.globalData}>
          <main className={inter.className}>
            <Component {...pageProps} className={inter.className} />
          </main>
        </MainProvider>
     
    </Layout>
  );
}

export default App;