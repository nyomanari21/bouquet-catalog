'use client';

import { useState } from "react";

export default function CopyOrderCode({ orderCode }: { orderCode: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
    }
    
    return (
        <div
            onClick={() => copyToClipboard(orderCode)}
            className="cursor-pointer w-full border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors block text-xs"
        >
            {isCopied ? "Kode Pesanan Disalin!" : "Salin Kode Pesanan"}
        </div>
    )
}