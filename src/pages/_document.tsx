import React from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';
import Script from 'next/script';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=1a95f9ff62869572f0f7c4f8e1f86b55&autoload=false`;

const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body>
    <Main />
    <NextScript />
    <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
