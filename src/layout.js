import React from "react";
import Head from 'next/head'
import Script from 'next/script.js';

export default function Layout({ children}) {
    return (
        <>
            <Script async
                strategy="lazyOnload"
                src="https://www.googletagmanager.com/gtag/js?id=G-CKCT7D2W6J"
            />
            <Script id="google-analytics-script" strategy="lazyOnload">
                {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                    
                      gtag('config', 'G-CKCT7D2W6J');
                    `}
            </Script>
            <Head>
                <title>Wapsi - Solutions</title>
                <meta name="Wapsi - Solutions - Home" content="Wapsi" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="author" content="Wapsi" />
                <meta name="description" content="Wapsi - Technology for fuel consumption reduction" />
                <meta name="keywords" content="Technology, mining, k'nup, IoT, hydrogen, telemetry, consumption, reduction, decarbonization, performance, operator, injection" />
                <meta name="robots" content="index, follow" />
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="Español" />
                <meta name="og:title" content="Wapsi - Technology for fuel consumption reduction" />
                <meta name="google-site-verification" content="2-CRsNdlVMPHrrg65_GyqF7uJhaLnNaVxn2EXa6ByRA" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
                {children}
        </>
    );
}
