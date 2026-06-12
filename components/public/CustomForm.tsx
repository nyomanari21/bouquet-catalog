'use client';

import { useState, DragEvent, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";

export default function CustomForm() {
    const router = useRouter();
    const [dragActive, setDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_whatsapp: "",
        customer_address: "",
        delivery_date: "",
        budget_request: 0,
        quantity: 1,
        flower_preferences: "",
        wrapper_color: "",
        bouquet_size: "small",
        notes: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    // Input change listener
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // Generate unique order code
    const generateOrderCode = () => {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `CST-${dateStr}-${randomStr}`;
    };

    // Checkout handler
    const handleCheckout = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let uploadedImageUrl = null;

            // Upload the image
            if (selectedFile) {
                // Create unique file name
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                const filePath = `custom-requests/${fileName}`;

                // Options for image compression
                const compressedOptions = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 800
                };

                // Compress the image
                const compressedFile = await imageCompression(selectedFile, compressedOptions);

                // Upload the image to Supabase Storage in reference-images
                const { error: uploadError } = await supabase.storage
                    .from('reference-images')
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                // Take image public URL to be stored in orders table
                const { data: urlData } = supabase.storage
                    .from('reference-images')
                    .getPublicUrl(filePath);

                uploadedImageUrl = urlData.publicUrl;
            }

            // Calculate estimated total price & generate unique order code
            // const estimatedTotalPrice = formData.budget_request * formData.quantity;
            const orderCode = generateOrderCode();

            // Insert order data to 'order' table
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_code: orderCode,
                    customer_name: formData.customer_name,
                    customer_whatsapp: formData.customer_whatsapp,
                    customer_address: formData.customer_address,
                    order_type: 'custom',
                    status: 'pending',
                    delivery_date: formData.delivery_date
                })
                .select('id')
                .single();

            if (orderError) throw orderError;

            const newOrderId = orderData.id;

            // Insert custom bouquet order to 'custom_order_details' table
            const { error: customOrderError } = await supabase
                .from('custom_order_details')
                .insert({
                    order_id: newOrderId,
                    quantity: formData.quantity,
                    budget_request: formData.budget_request,
                    flower_preferences: formData.flower_preferences,
                    wrapper_color: formData.wrapper_color,
                    bouquet_size: formData.bouquet_size,
                    notes: formData.notes,
                    reference_image_url: uploadedImageUrl
                })

            if (customOrderError) throw customOrderError;

            // Redirect to success page
            router.push(`/order-success?code=${orderCode}`);
        } catch (error: any) {
            alert(`Waduh, checkout gagal: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {/* Form */}
            <div className="mt-10 p-6 rounded-lg border border-[#e75888]/20 shadow-md shadow-[#e75888]/20 bg-white">
                <form onSubmit={handleCheckout}>
                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Form Buket Custom</h2>

                    {/* Grid Data Diri */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="customer_name" className="font-medium text-sm text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} placeholder="Masukkan nama lengkap" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="customer_whatsapp" className="font-medium text-sm text-gray-700">Nomor WhatsApp <span className="text-red-500">*</span></label>
                            <input type="tel" name="customer_whatsapp" value={formData.customer_whatsapp} onChange={handleInputChange} placeholder="08123456789" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="customer_address" className="font-medium text-sm text-gray-700">Alamat Pengiriman <span className="text-red-500">*</span></label>
                        <textarea name="customer_address" value={formData.customer_address} onChange={handleInputChange} rows={2} placeholder="Masukkan alamat lengkap pengiriman atau tulis 'Ambil di toko'" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                    </div>

                    {/* Grid Budget & Spec */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="budget_request" className="font-medium text-sm text-gray-700">Budget per Buket <span className="text-red-500">*</span></label>
                            <input type="number" name="budget_request" value={formData.budget_request} onChange={handleInputChange} placeholder="Contoh: 150000" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="quantity" className="font-medium text-sm text-gray-700">Jumlah Pesanan (Qty) <span className="text-red-500">*</span></label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="delivery_date" className="font-medium text-sm text-gray-700">Tanggal Pengiriman <span className="text-red-500">*</span></label>
                            <input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleInputChange} className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="flower_preferences" className="font-medium text-sm text-gray-700">Preferensi Bunga <span className="text-red-500">*</span></label>
                        <input type="text" name="flower_preferences" value={formData.flower_preferences} onChange={handleInputChange} placeholder="Contoh: Mawar merah hidup dicampur baby breath" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="wrapper_color" className="font-medium text-sm text-gray-700">Warna Pembungkus <span className="text-red-500">*</span></label>
                        <input type="text" name="wrapper_color" value={formData.wrapper_color} onChange={handleInputChange} placeholder="Contoh: Kertas tisu pink muda atau putih" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" required />
                    </div>

                    <fieldset className="mt-4">
                        <legend className="font-medium text-sm text-gray-700">Ukuran Buket <span className="text-red-500">*</span></legend>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#e75888]">
                                <input name="bouquet_size" type="radio" value="small" checked={formData.bouquet_size === "small"} onChange={handleInputChange} className="h-4 w-4 text-[#e75888] focus:ring-[#e75888]" />
                                <span className="text-sm text-gray-900">Kecil (10-15 batang)</span>
                            </label>
                            <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#e75888]">
                                <input name="bouquet_size" type="radio" value="medium" checked={formData.bouquet_size === "medium"} onChange={handleInputChange} className="h-4 w-4 text-[#e75888] focus:ring-[#e75888]" />
                                <span className="text-sm text-gray-900">Sedang (16-25 batang)</span>
                            </label>
                            <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#e75888]">
                                <input name="bouquet_size" type="radio" value="large" checked={formData.bouquet_size === "large"} onChange={handleInputChange} className="h-4 w-4 text-[#e75888] focus:ring-[#e75888]" />
                                <span className="text-sm text-gray-900">Besar (&ge; 26 batang)</span>
                            </label>
                        </div>
                    </fieldset>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="notes" className="font-medium text-sm text-gray-700">Catatan Tambahan</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="Tulis tambahan seperti cokelat, boneka wisuda, atau isi kartu ucapan..." className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]" />
                    </div>

                    {/* Image Input */}
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="font-medium text-sm text-gray-700">Foto Referensi Buket</label>
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors relative min-h-40 ${
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
                        <button type="submit" disabled={isLoading} className="bg-[#e75888] text-white py-2.5 px-6 rounded-md hover:bg-[#d44a7a] transition-colors cursor-pointer font-medium text-sm shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? "Memproses Pesanan..." : "Pesan Buket Custom"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}