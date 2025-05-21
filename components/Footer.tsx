import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Company Info */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Jersey</h2>
          <p className="text-gray-400">
            Your ultimate destination for high-quality shopping.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <Link href="/products" className="hover:text-purple-400">Products</Link>
          <Link href="/compare" className="hover:text-purple-400">Compare</Link>
          <Link href="/about" className="hover:text-purple-400">About Us</Link>
          <Link href="/contact" className="hover:text-purple-400">Contact</Link>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-4">
          <span className="text-white font-medium">Follow us:</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-purple-400"><Facebook /></a>
            <a href="#" className="hover:text-purple-400"><Instagram /></a>
            <a href="#" className="hover:text-purple-400"><Twitter /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} Jersey. All rights reserved.
      </div>
    </footer>
  );
}
