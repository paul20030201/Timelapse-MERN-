"use client";
import { LayoutProvider } from "../layout/context/layoutcontext";
import { Provider } from 'react-redux';
import { makeStore } from '../redux/store'


import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "../styles/demo/Demos.scss";
import "../styles/layout/layout.scss";

interface RootLayoutProps {
  children: React.ReactNode;
}

const store = makeStore();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          id="theme-link"
          href={`/theme/theme-light/indigo/theme.css`}
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <Provider store={store}>
          <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </PrimeReactProvider>
        </Provider>
      </body>
    </html>
  );
}