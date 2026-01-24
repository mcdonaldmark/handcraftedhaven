import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "An online marketplace for handmade goods",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <footer className="site-footer">
            <p>&copy; 2026 Handcrafted Haven | WDD 430 Team Project</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
