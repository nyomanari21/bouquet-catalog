'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterDropdownProps {
  categories: string[]
}

export default function FilterDropdown({ categories }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || ''

  const handleCategorySelect = (category: string) => {
    setIsOpen(false)
    if (category === '') {
      router.push('/product')
    } else {
      router.push(`/product?category=${encodeURIComponent(category)}`)
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-[#e75888] text-[#e75888] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#e75888] hover:text-white transition-colors flex justify-between items-center gap-2 font-medium"
      >
        <span>{activeCategory ? `Kategori: ${activeCategory}` : 'Semua Kategori'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 1024 1024" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M0 0h1024v1024H0z" fill="none" />
          <path fill="currentColor" d="M831.9 340.9L512 652.7L192.1 340.9a30.6 30.6 0 0 0-42.7 0a29 29 0 0 0 0 41.6l340.3 331.7a32 32 0 0 0 44.6 0l340.3-331.7a29 29 0 0 0 0-41.7a30.6 30.6 0 0 0-42.7 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white border-2 border-[#e75888] shadow-lg z-10 overflow-hidden flex flex-col">
          <button
            onClick={() => handleCategorySelect('')}
            className={`cursor-pointer text-left px-4 py-2 text-sm hover:bg-[#e75888] hover:text-white transition-colors ${activeCategory === '' ? 'bg-pink-50 font-semibold text-[#e75888]' : 'text-gray-700'}`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`cursor-pointer text-left px-4 py-2 text-sm hover:bg-[#e75888] hover:text-white transition-colors ${activeCategory === cat ? 'bg-pink-50 font-semibold text-[#e75888]' : 'text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}