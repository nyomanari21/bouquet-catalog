'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    category: string;
}

interface CatalogTableProps {
    initialProducts: Product[];
}

export default function CatalogTable({ initialProducts }: CatalogTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleCreateData = () => {
        router.push('/admin/catalog/create');
    };

    // Live Search
    const filteredProducts = initialProducts.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
        );
    });

    // Pagination
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Slice array of data based on the currently active page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Page changer function
    const goToPage = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    // Reset page number to 1 everytime a user types in the search bar
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    // Delete data handler
    const handleDeleteData = async (id: string, name: string) => {
        if (window.confirm(`Apakah yakin ingin menghapus data ${name} ${id}?`)) {
            try {
                // Delete data
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id)

                if (error) throw error;

                // Reload page
                alert('Berhasil dihapus!');
                router.refresh();
            } catch (err: any) {
                alert(`Gagal menghapus data: ${err.message}`);
            }
        }
    }

    return (
        <div className="space-y-4">
            {/* Search Bar Element */}
            <div className="flex justify-between">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center w-full max-w-md gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.601z" />
                    </svg>
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Cari nama buket atau kategori..." 
                        className="w-full bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                    />
                    {searchTerm && (
                        <button onClick={() => { setSearchTerm(""); setCurrentPage(1); }} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
                            Clear
                        </button>
                    )}
                </div>
                <button 
                    onClick={handleCreateData}
                    className="w-fit bg-green-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-green-600 transition-colors cursor-pointer shadow-sm"
                >
                    Tambah Data
                </button>
            </div>

            {/* Table Content */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-sm text-left">
                        <thead className="text-xs font-bold text-gray-700 uppercase bg-gray-50/70 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-center w-12">No</th>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Deskripsi</th>
                                <th className="px-4 py-3">Harga</th>
                                <th className="px-4 py-3 w-24">Gambar</th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-100 text-gray-600 bg-white">
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5 text-center font-medium text-gray-400">
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="px-4 py-3.5 font-semibold text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3.5 max-w-xs truncate">{item.description}</td>
                                    <td className="px-4 py-3.5 font-medium">
                                        Rp{Number(item.price).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                "No Image"
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-md font-medium capitalize">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 flex flex-wrap gap-2">
                                        <button type="button" onClick={() => handleDeleteData(item.id, item.name)} className="bg-red-500 text-white border border-gray-200 py-1 px-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer font-medium text-sm shadow-sm">
                                            Hapus
                                        </button>
                                        <button type="button" className="bg-yellow-500 text-white border border-gray-200 py-1 px-2 rounded-md hover:bg-yellow-600 transition-colors cursor-pointer font-medium text-sm shadow-sm">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-xs">
                                        Tidak ada produk buket yang cocok dengan pencarianmu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controller */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-50 bg-gray-50/30 text-xs">
                        <span className="text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-700">{indexOfFirstItem + 1}</span> - <span className="font-semibold text-gray-700">{Math.min(indexOfLastItem, totalItems)}</span> dari <span className="font-semibold text-gray-700">{totalItems}</span> total produk
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-medium text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                &larr; Prev
                            </button>
                        
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`w-7 h-7 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                                    currentPage === page
                                        ? "bg-[#e75888] text-white"
                                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {page}
                                </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-medium text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}