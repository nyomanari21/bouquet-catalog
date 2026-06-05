import TrackOrderAction from "@/components/public/TrackOrderAction"

export default async function TrackOrder({}) {
    return (
        <main className="px-8 md:px-20 py-10">
            <div className="max-w-md w-full mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-sm shadow-[#e75888]/20 text-center">
                <h1 className="text-xl font-bold text-[#e75888]">Lacak Pesananmu!</h1>

                {/* <form onSubmit={}>
                    <div className="flex flex-col gap-1.5 mt-4">
                        <input type="text" name="order_code" placeholder="Masukkan kode pesanan" className="w-full bg-white p-2 rounded-lg border border-gray-200 outline-none focus:border-[#e75888]" required />
                    </div>
                    <button type="submit" className="w-full bg-[#e75888] text-white py-2 rounded-lg mt-4 hover:bg-[#e75888]/90 transition-colors">Lacak Pesanan</button>
                </form> */}

                <TrackOrderAction />
            </div>
        </main>
    )
}