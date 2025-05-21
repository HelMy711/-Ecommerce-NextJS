import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      <body className="bg-white text-black">
        <Navbar />
        <main className="min-h-[70vh] px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
