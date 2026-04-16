"use client"


import { useState, useEffect } from "react";
import { PixelBackground } from "@/components/pixel-background";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header"

export default function Login() {
   
    
    return(
        <div className="min-h-screen flex flex-col relative overflow-hidden">
             <PixelBackground />
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
            <Header />
            <form>
                <input
                    name="username"
                    placeholder="Username"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mt-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Login
                </button>
            </form>

            </main>
        </div>
    );
}