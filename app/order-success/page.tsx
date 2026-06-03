import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyOrderCode from "@/components/CopyOrderCode";

interface PageProps {
    searchParams: Promise<{ code?: string }>
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const orderCode = params.code || '';

    if (!orderCode) {
        return notFound();
    }

    const { data: order, error } = await supabase
        .from('orders')
        .select('customer_name, total_price, order_type')
        .eq('order_code', orderCode)
        .single();

    if (error || !order) {
        return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center p-8 bg-white rounded-xl border border-gray-100 max-w-md shadow-sm">
                <p className="text-red-500 font-medium">Kode pesanan tidak valid atau tidak ditemukan.</p>
                <Link href="/product" className="mt-4 inline-block text-[#e75888] font-semibold hover:underline">
                    &larr; Kembali ke Katalog
                </Link>
            </div>
        </main>
        );
    }

    const isCustom = order.order_type === 'custom';

    const waMessage = isCustom
        ? `Halo Admin, saya mau konfirmasi untuk *Pesanan Custom Buket* saya dengan Kode: *${orderCode}* atas nama *${order.customer_name}*. Mohon segera dicek spesifikasinya dan informasikan total harganya ya min, terima kasih!`
        : `Halo Admin, saya mau konfirmasi pembayaran untuk pesanan dengan Kode: *${orderCode}* atas nama *${order.customer_name}*. Mohon info nomor rekeningnya ya min!`;

    const whatsappUrl = `https://wa.me/628158155594?text=${encodeURIComponent(waMessage)}`;

    return (
        <main className="min-h-screen bg-gray-50/50 flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm shadow-[#e75888]/20 text-center">
                
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                {/* Order Success Message */}
                <h1 className="text-2xl font-bold text-gray-800">Pesanan Berhasil Dibuat!</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Hai <span className="font-semibold text-gray-700">{order.customer_name}</span>, buket impianmu sudah berhasil tercatat di sistem kami.
                </p>

                {/* Kotak Detail Kode Pesanan */}
                <div className="mt-6 bg-[#e75888]/5 border border-[#e75888]/10 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Kode Pesanan:</span>
                        <span className="font-mono font-bold text-gray-800">{orderCode}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                        <span className="text-gray-500">Jenis Pesanan:</span>
                        <span className="font-medium text-gray-700 capitalize">{order.order_type} Buket</span>
                    </div>
                    {order.total_price && (
                        <div className="flex justify-between text-xs border-t border-gray-100 pt-2">
                            <span className="text-gray-500">Total Pembayaran:</span>
                            <span className="font-bold text-[#e75888]">Rp{order.total_price.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-6 text-xs text-left text-gray-600 bg-gray-50 p-4 rounded-xl space-y-2 leading-relaxed">
                    <p className="font-semibold text-gray-700">Langkah Selanjutnya:</p>
                    {isCustom ? (
                        <p>1. Klik tombol di bawah untuk konfirmasi ke WhatsApp Admin dan mendapatkan kalkulasi harga.</p>
                    ) : (
                        <p>1. Klik tombol di bawah untuk konfirmasi ke WhatsApp Admin guna mendapatkan nomor rekening pembayaran.</p>
                    )}
                    <p>2. Lakukan transfer sesuai nominal total (untuk katalog biasa) atau tunggu kalkulasi harga dari admin (untuk kustomisasi).</p>
                    <p>3. Setelah pembayaran diterima, admin akan menghubungi Anda untuk konfirmasi pengiriman.</p>
                    <p>4. Salin Kode Pesanan untuk cek status pesanan pada halaman Lacak Pesanan.</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                    <Link 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#e75888] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#d44a7a] transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                        Hubungi Admin Via WhatsApp
                    </Link>

                    <CopyOrderCode orderCode={orderCode} />
                    
                    <Link href="/product" className="w-full border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors block text-xs">
                        Kembali Belanja
                    </Link>
                </div>

            </div>
        </main>
    );
}