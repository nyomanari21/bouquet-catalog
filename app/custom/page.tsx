import CustomForm from "@/components/CustomForm";

export default function CustomBouquet() {
  return (
    <main className="px-8 md:px-20 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#e75888] font-bold text-center">Buat Buket Impianmu</h1>

        {/* Form */}
        <CustomForm />
        
      </div>
    </main>
  );
}