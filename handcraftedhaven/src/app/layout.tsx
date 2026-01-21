import type { Metadata } from 'next';
import './globals.css';
import Header from './components/header'; // Client Component with hamburger menu

export const metadata: Metadata = {
  title: 'Handcrafted Haven',
  description: 'An online marketplace for handmade goods',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header with mobile hamburger menu */}
        <Header />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="site-footer">
          <p>&copy; 2026 Handcrafted Haven | WDD 430 Team Project</p>
        </footer>
      </body>
    </html>
  );
}
