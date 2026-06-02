'use client';

import { useState, DragEvent, ChangeEvent } from "react";

export default function CustomBouquet() {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file preview logic
  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Drag listeners
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Drop listener
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Input change listener (tombol browse biasa)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <main className="px-8 md:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#e75888] font-bold text-center">Buat Buket Impianmu</h1>

        {/* Form */}
        <div className="mt-10 p-6 rounded-lg border border-[#e75888]/20 shadow-md shadow-[#e75888]/20 bg-white">
          <form onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Form Buket Custom</h2>

            {/* Grid Data Diri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="customer_name" className="font-medium text-sm text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" id="customer_name" name="customer_name" placeholder="Masukkan nama lengkap" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="customer_whatsapp" className="font-medium text-sm text-gray-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <input type="tel" id="customer_whatsapp" name="customer_whatsapp" placeholder="08123456789" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="customer_address" className="font-medium text-sm text-gray-700">Alamat Pengiriman <span className="text-red-500">*</span></label>
              <input type="text" id="customer_address" name="customer_address" placeholder="Masukkan alamat lengkap pengiriman atau tulis 'Ambil di Toko'" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
            </div>

            {/* Grid Budget & Spec */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="budget_request" className="font-medium text-sm text-gray-700">Budget per Buket <span className="text-red-500">*</span></label>
                <input type="number" id="budget_request" name="budget_request" placeholder="Contoh: 150000" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="quantity" className="font-medium text-sm text-gray-700">Jumlah Pesanan (Qty) <span className="text-red-500">*</span></label>
                <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="delivery_date" className="font-medium text-sm text-gray-700">Tanggal Pengiriman <span className="text-red-500">*</span></label>
                <input type="date" id="delivery_date" name="delivery_date" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="flower_preferences" className="font-medium text-sm text-gray-700">Preferensi Bunga <span className="text-red-500">*</span></label>
              <input type="text" id="flower_preferences" name="flower_preferences" placeholder="Contoh: Mawar merah hidup dicampur baby breath" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="wrapper_color" className="font-medium text-sm text-gray-700">Warna Pembungkus <span className="text-red-500">*</span></label>
              <input type="text" id="wrapper_color" name="wrapper_color" placeholder="Contoh: Kertas tisu pink muda atau putih" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
            </div>

            <fieldset className="mt-4">
              <legend className="font-medium text-sm text-gray-700">Ukuran Buket <span className="text-red-500">*</span></legend>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#e75888]">
                  <input defaultChecked name="bouquet_size" type="radio" value="small" className="h-4 w-4 text-[#e75888] focus:ring-[#e75888]" />
                  <span className="text-sm text-gray-900">Kecil (10-15 batang)</span>
                </label>
                <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#e75888]">
                  <input name="bouquet_size" type="radio" value="medium" className="h-4 w-4 text-[#e75888] focus:ring-[#e75888]" />
                  <span className="text-sm text-gray-900">Sedang (16-25 batang)</span>
                </label>
                <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#e75888]">
                  <input name="bouquet_size" type="radio" value="large" className="h-4 w-4 text-[#e75888] focus:ring-[#e75888]" />
                  <span className="text-sm text-gray-900">Besar (&ge; 26 batang)</span>
                </label>
              </div>
            </fieldset>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="notes" className="font-medium text-sm text-gray-700">Catatan Tambahan</label>
              <textarea id="notes" name="notes" rows={3} placeholder="Tulis tambahan seperti cokelat, boneka wisuda, atau isi kartu ucapan..." className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" />
            </div>

            {/* UPGRADE: Drag and Drop Area Gambar Referensi */}
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-medium text-sm text-gray-700">Foto Referensi Buket</label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors relative min-h-[160px] ${
                  dragActive ? "border-[#e75888] bg-[#e75888]/5" : "border-gray-300 bg-white hover:border-[#e75888]"
                }`}
              >
                <input
                  type="file"
                  id="reference_photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <img src={imagePreview} alt="Preview" className="h-32 w-auto object-cover rounded-md shadow-sm" />
                    <label htmlFor="reference_photo" className="text-xs text-[#e75888] font-semibold underline cursor-pointer hover:text-[#d44a7a]">
                      Ganti Foto
                    </label>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 childhood .375 0 11-.75 0 .375 .375 0 01.75 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">Tarik dan lepas gambar di sini, atau</p>
                    <label htmlFor="reference_photo" className="mt-1 text-sm text-[#e75888] font-semibold underline cursor-pointer hover:text-[#d44a7a]">
                      Pilih File dari Komputer
                    </label>
                    <p className="text-xs text-gray-400 mt-1">Mendukung format PNG, JPG, atau JPEG</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end items-center mt-6">
              <button type="submit" className="bg-[#e75888] text-white py-2.5 px-6 rounded-md hover:bg-[#d44a7a] transition-colors cursor-pointer font-medium text-sm shadow-sm">
                Pesan Buket Custom
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}