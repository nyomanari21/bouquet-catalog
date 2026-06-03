import TrackOrderAction from "@/components/TrackOrderAction"

export default function TrackOrder() {
    return (
        <main className="px-8 md:px-20 py-10">
            <div className="max-w-md w-full mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-sm shadow-[#e75888]/20 text-center">
                <h1 className="text-xl font-bold text-[#e75888]">Lacak Pesananmu!</h1>

                <TrackOrderAction />
            </div>
        </main>
    )
}