'use client';

import { useState, DragEvent, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CatalogForm() {
    const router = useRouter();
    const [dragActive, setDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
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

    // Generate slug
    const generateSlug = () => {
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return slug;
    };

    // Create handler
    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let uploadedImageUrl = null;

            // Upload the image
            if (selectedFile) {
                // Create unique file name
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                const filePath = `catalog/${fileName}`;

                // Upload the image to Supabase Storage in reference-images
                const { error: uploadError } = await supabase.storage
                    .from('reference-images')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                // Take image public URL to be stored in orders table
                const { data: urlData } = supabase.storage
                    .from('reference-images')
                    .getPublicUrl(filePath);

                uploadedImageUrl = urlData.publicUrl;
            }

            // generate slug
            const slug = generateSlug();

            // Insert product data to 'products' table
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    image_url: uploadedImageUrl,
                    category: formData.category,
                    slug: slug,
                })

            if (productError) throw productError;

            // Redirect to catalog page
            router.push(`/admin/catalog`);
        } catch (error: any) {
            alert(`Waduh, tambah data buket gagal: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = () => {
        // Redirect to catalog page
        router.push(`/admin/catalog`);
    }

    return (
        <div>
            {/* Form */}
            <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <form onSubmit={handleCreate}>
                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Form Tambah Data Buket</h2>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="name" className="font-medium text-sm text-gray-700">Nama</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama buket" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]/20" required />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="description" className="font-medium text-sm text-gray-700">Deskripsi</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} placeholder="Deksripsi buket" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]/20" required />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="price" className="font-medium text-sm text-gray-700">Harga</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Contoh: 150000" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]/20" required />
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="category" className="font-medium text-sm text-gray-700">Kategori</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Contoh: Pernikahan, Wisuda" className="bg-white p-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:ring-1 focus:ring-[#e75888]/20" required />
                    </div>

                    {/* Image Input */}
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="font-medium text-sm text-gray-700">Gambar Buket</label>
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
                        <button type="button" onClick={handleCancel} className="bg-red-500 text-white border border-gray-200 py-2.5 px-6 rounded-md hover:bg-red-600 transition-colors cursor-pointer font-medium text-sm shadow-sm me-4">
                            Kembali
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-green-500 text-white py-2.5 px-6 rounded-md hover:bg-green-600 transition-colors cursor-pointer font-medium text-sm shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? "Memproses Penambahan..." : "Tambah Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}