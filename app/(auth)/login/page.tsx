'use client';

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            // Sign in with supabase auth function
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

            if (error) throw error;

            // Rederict to dashboard page if login is success
            if (data?.user) {
                router.push("/admin/dashboard");
            }

        } catch (err: any) {
            setErrorMessage(err.message || "Gagal masuk, coba periksa lagi akunmu.")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="px-8 md:px-20 py-10 flex flex-col justify-center">
            <div className="md:min-w-sm mx-auto">
                <div className="p-6 gap-4 border border-[#e75888]/10 shadow-md shadow-[#e75888]/20 rounded-lg">
                    <div className="text-center mb-6">
                        {/* Ikon Gembok / Logo */}
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#e75888]/10 text-[#e75888] mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
                        <p className="text-xs text-gray-400 mt-1">Khusus manajemen Bouquet by Dila</p>
                    </div>

                    {/* Error Notification */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg text-center font-medium">
                            {errorMessage}
                        </div>
                    )}

                    {/* Forms */}
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="delivery_date" className="font-semibold text-sm text-gray-700">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full bg-gray-50 p-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:bg-white transition-all placeholder:normal-case"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            <label htmlFor="delivery_date" className="font-semibold text-sm text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full bg-gray-50 p-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#e75888] focus:bg-white transition-all placeholder:normal-case"
                                required
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-8 bg-[#e75888] text-white p-3 rounded-lg font-semibold hover:bg-[#d44a7a] transition-colors cursor-pointer text-sm shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? "Tunggu..." : "Masuk"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}