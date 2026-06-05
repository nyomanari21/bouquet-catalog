'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Flower2, 
  Menu, 
  X 
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Manajemen Pesanan", icon: ShoppingBag },
  { href: "/admin/products", label: "Katalog Buket", icon: Flower2 },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Mode Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-slate-100 shadow-sm flex-shrink-0">
        
        {/* Kontainer Logo Atas */}
        <div className="p-6 border-b border-slate-50 flex justify-center items-center">
          <div className="relative w-40 h-16">
            <Image 
              src="/logo-nobg.png" 
              alt="Bouquet by Dila" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* List Menu Navigasi */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1.5">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? "text-[#e75888] bg-[#e75888]/5 font-semibold"
                        : "text-slate-500 hover:text-[#e75888] hover:bg-slate-50"
                    }`}
                  >
                    <Icon 
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-[#e75888]" : "text-slate-400 group-hover:text-[#e75888]"
                      }`} 
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer Kecil Sidebar Admin */}
        <div className="p-4 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-400 font-medium">v1.0 • Bouquet by Dila Admin Panel</p>
        </div>
      </aside>


      {/* Mobile Mode Navbar */}
      {/* Top Header Bar Mobile */}
      <header className="md:hidden w-full h-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 left-0 z-40 flex items-center justify-between px-4">
        <div className="relative w-28 h-10">
          <Image 
            src="/logo-nobg.png" 
            alt="Bouquet by Dila" 
            fill
            className="object-contain"
          />
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="p-2 text-slate-600 hover:text-[#e75888] hover:bg-slate-50 rounded-xl transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop Gelap saat Drawer Mobile Terbuka */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Menu Canvas */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Bagian Atas di Dalam Drawer */}
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Menu Manajemen</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Menu di Dalam Drawer Mobile */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#e75888] bg-[#e75888]/5 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#e75888]" : "text-slate-400"}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}