import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from '../Context/ThemeContext';


export const metadata = {
  title: 'Jersey',
  description: 'أفضل منصة لشراء كل ما تحتاجه من ملابس رياضية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen transition-colors duration-500 text-black dark:text-white bg-gradient-to-br from-[#B9EAB6] to-white dark:from-[#1E3D22] dark:to-black">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen py-12 px-6 transition-colors duration-500">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

