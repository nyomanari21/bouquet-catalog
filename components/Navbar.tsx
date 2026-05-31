"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/product", label: "Produk" },
  { href: "/custom", label: "Custom" },
  { href: "/contact", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

        <div className="flex items-center justify-center h-16">

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-4">
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
            </ul>
        </div>
    </nav>
  );
}