import { JetBrains_Mono } from "@next/font/google";
import { MainProvider } from "@/src/contexts/Main-context";
import "@/src/global.scss";
import Layout from "@/src/layout";
import { AuthProvider } from "@/src/contexts/AuthContext";

const inter = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

function App({ Component, pageProps }) {
  return (
    <Layout>
      <AuthProvider>
        <MainProvider globalData={pageProps.globalData}>
          <main className={inter.className}>
            <Component {...pageProps} className={inter.className} />
          </main>
        </MainProvider>
      </AuthProvider>
    </Layout>
  );
}

export default App;