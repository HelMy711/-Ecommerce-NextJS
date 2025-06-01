'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineHeart, AiOutlineUser, AiOutlineLogin, AiOutlineUserAdd, AiFillProduct, AiOutlineGlobal, AiOutlineCheck } from 'react-icons/ai';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [language, setLanguage] = useState('en');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', icon: <AiOutlineHome size={32} />, label: 'Home' },
    { href: '/products', icon: <AiFillProduct size={32} />, label: 'Products' },
    { href: '/wishlist', icon: <AiOutlineHeart size={32} />, label: 'Wishlist' },
    { href: '/cart', icon: <AiOutlineShoppingCart size={32} />, label: 'Cart' },
    { href: '/login', icon: <AiOutlineLogin size={32} />, label: 'Login' },
    { href: '/register', icon: <AiOutlineUserAdd size={32} />, label: 'Register' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    setHasToken(!!localStorage.getItem('token'));
  }, []);

  const filteredLinks = navLinks.filter(
    (link) =>
      !(
        hasToken &&
        (link.href === '/login' || link.href === '/register')
      )
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen((prev) => !prev);
  };

  const setLanguagePreference = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setLanguageDropdownOpen(false); 
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const checkTokenPresence = () => {
      const token = localStorage.getItem("token");
      setHasToken(!!token);
    };

    checkTokenPresence();
  }, [pathname]);

  return (
    <nav className="bg-transparent text-[#b5f1b1] dark:text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between h-20 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl mr-6"
            style={{
              color: darkMode ? "#fff" : "#b5f1b1",
              textShadow: darkMode ? "0 1px 4px #000" : "0 1px 4px #b5f1b1",
            }}
          >
            <img
              src="/jersey-logo.png"
              alt="Jersey Logo"
              className="h-20 w-28 object-contain rounded-md shadow"
            />
          </Link>

       
          <div className="flex-1 flex justify-end items-center">
            <div className="hidden md:flex space-x-6 items-center">
              {filteredLinks.map(({ href, icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 transition"
                  style={{
                    color: darkMode ? "#b5f1b1" : "#000",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = darkMode ? "#b5f1b1" : "#000")}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
              {hasToken && (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 ml-2 transition"
                  style={{
                    color: darkMode ? "#b5f1b1" : "#000",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = darkMode ? "#b5f1b1" : "#000")}
                >
                  <AiOutlineUser size={32} />
                  <span>Profile</span>
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center gap-2 px-3 py-1 border rounded-md border-[#b5f1b1] dark:border-white bg-transparent text-[#b5f1b1] dark:text-white transition hover:bg-[#b5f1b1] hover:text-black dark:hover:bg-[#b5f1b1] dark:hover:text-black"
                >
                  <AiOutlineGlobal size={24} />
                </button>
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-black border border-[#b5f1b1] dark:border-white rounded-md shadow-lg">
                    <button
                      onClick={() => setLanguagePreference('ar')}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-[#b5f1b1] dark:text-white hover:bg-[#b5f1b1] hover:text-black dark:hover:bg-[#b5f1b1] dark:hover:text-black"
                    >
                      Arabic
                      {language === 'ar' && <AiOutlineCheck size={16} />}
                    </button>
                    <button
                      onClick={() => setLanguagePreference('en')}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-[#b5f1b1] dark:text-white hover:bg-[#b5f1b1] hover:text-black dark:hover:bg-[#b5f1b1] dark:hover:text-black"
                    >
                      English
                      {language === 'en' && <AiOutlineCheck size={16} />}
                    </button>
                  </div>
                )}
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="hidden"
                />
                <div className="relative w-12 h-6 bg-[#b5f1b1] dark:bg-white rounded-full shadow-inner transition-colors duration-300">
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-black rounded-full shadow transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-[#b5f1b1] dark:text-white">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </label>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#b5f1b1] dark:text-white hover:text-[#b5f1b1] focus:outline-none"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-transparent px-4 pb-4 space-y-2 border-b border-[#b5f1b1] dark:border-white">
          {filteredLinks.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 block transition"
              style={{
                color: darkMode ? "#b5f1b1" : "#000",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = darkMode ? "#b5f1b1" : "#000")}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
          {hasToken && (
            <Link
              href="/profile"
              className="flex items-center gap-2 block transition"
              style={{
                color: darkMode ? "#b5f1b1" : "#000",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = darkMode ? "#b5f1b1" : "#000")}
            >
              <AiOutlineUser size={32} />
              <span>Profile</span>
            </Link>
          )}
          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center gap-2 px-3 py-1 border rounded-md border-[#b5f1b1] dark:border-white bg-transparent text-[#b5f1b1] dark:text-white transition hover:bg-[#b5f1b1] hover:text-black dark:hover:bg-[#b5f1b1] dark:hover:text-black"
            >
              <AiOutlineGlobal size={24} />
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-black border border-[#b5f1b1] dark:border-white rounded-md shadow-lg">
                <button
                  onClick={() => setLanguagePreference('ar')}
                  className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-[#b5f1b1] dark:text-white hover:bg-[#b5f1b1] hover:text-black dark:hover:bg-[#b5f1b1] dark:hover:text-black"
                >
                  Arabic
                  {language === 'ar' && <AiOutlineCheck size={16} />}
                </button>
                <button
                  onClick={() => setLanguagePreference('en')}
                  className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-[#b5f1b1] dark:text-white hover:bg-[#b5f1b1] hover:text-black dark:hover:bg-[#b5f1b1] dark:hover:text-black"
                >
                  English
                  {language === 'en' && <AiOutlineCheck size={16} />}
                </button>
              </div>
            )}
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="hidden"
            />
            <div className="relative w-12 h-6 bg-[#b5f1b1] dark:bg-white rounded-full shadow-inner transition-colors duration-300">
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-black rounded-full shadow transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-[#b5f1b1] dark:text-white">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </label>
        </div>
      )}
    </nav>
  );
}
