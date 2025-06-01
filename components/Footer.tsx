"use client";

import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../Context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-transparent py-10 mt-10 border-t border-[#b5f1b1]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Company Info */}
        <div>
          <h2 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Jersey</h2>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Your ultimate destination for high-quality shopping.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <Link href="/products" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Products</Link>
          <Link href="/compare" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Compare</Link>
          <Link href="/about" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>About Us</Link>
          <Link href="/contact" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Contact</Link>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-4">
          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Follow us:</span>
          <div className="flex gap-4">
            <a href="#" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}><Facebook /></a>
            <a href="#" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}><Instagram /></a>
            <a href="#" className={`hover:text-[#b5f1b1] ${theme === 'dark' ? 'text-white' : 'text-black'}`}><Twitter /></a>
          </div>
        </div>
      </div>

      <div className={`text-center text-xs mt-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        © {new Date().getFullYear()} Jersey. All rights reserved.
      </div>
    </footer>
  );
}
