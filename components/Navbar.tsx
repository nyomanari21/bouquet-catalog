"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/product", label: "Produk" },
  { href: "/custom", label: "Custom" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useCartStore();
  const cartItemCount = cart.length;

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="min-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-[#e75888]/10">

        {/* Logo */}
        <div className="flex justify-center p-4" style={{width: "auto"}}>
            <Image src="/logo-nobg.png" alt="Bouquet by Dila" width={400} height={50} loading="eager" />
        </div>

        <div className="flex items-center justify-between h-16">

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center justify-center w-full">
                {/* Navigation Links */}
                <ul className="flex items-center gap-4">
                    {/* Instagram Link */}
                    <Link href="https://instagram.com/bouquet.bydileh/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#e75888] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                        </svg>
                    </Link>
                    {navLinks.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                        <li key={href}>
                            <Link
                            href={href}
                            className={`relative px-4 py-2 text-xl font-medium
                                ${
                                isActive
                                    ? "text-[#e75888] border-b-3 border-[#e75888] font-semibold"
                                    : "text-gray-600 hover:text-[#e75888] transition-colors"
                                }`}
                            >
                            {label}
                            </Link>
                        </li>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile Hamburger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <span
                    className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                />
                <span
                    className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                    className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                />
            </button>

            {/* Cart Link */}
            <div className="flex items-center relative">
                <Link href="/cart" className={"cursor-pointer hover:text-[#e75888] transition-colors" + (pathname === "/cart" ? " text-[#e75888] font-semibold" : "")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z" />
                    </svg>
                </Link>
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#e75888] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </div>
        </div>

        {/* Mobile Menu */}
        <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-72 opacity-100 pb-4" : "max-h-0 opacity-0"
            }`}
        >
            <ul className="flex flex-col gap-1 pt-2">
                {navLinks.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <li key={href}>
                            <Link
                            href={href}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                ? "text-[#e75888] bg-[#e75888]/10 font-semibold"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                            >
                            {label}
                            </Link>
                        </li>
                    );
                })}
                <div className="flex items-center justify-center gap-4 mt-4">
                    {/* Instagram Link */}
                    <Link href="https://instagram.com/bouquet.bydileh/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#e75888] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                        </svg>
                    </Link>
                </div>
            </ul>
        </div>
    </nav>
  );
}