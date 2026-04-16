"use client"

import { useState, useEffect } from "react";
import { PixelBackground } from "@/components/pixel-background";
import { supabase } from "@/lib/supabase-client.js";
import { useRouter } from "next/navigation";

export default function Login() {
   
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const router = useRouter();

    async function handleLogin (e) {

        e.preventDefault();

        // fetch email with the username from profiles table
        const { data: user } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username)
        .single();    

        // sign in with the fetched email using supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
            email: user?.email,
            password: password
        });

        if (error) {
            console.error(error.message);
            return;
        }

        // if there's no error, redirect 
        router.push('/');
    }
    
    return(
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <PixelBackground />
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
                <form onSubmit={handleLogin}>
                    <input
                        name="username"
                        placeholder="Username"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        type="text" 
                        id="username" 
                        onChange={(e)=>setUsername(e.target.value)}
                        required
                    />
                    <input
                        name="password"
                        type="text"
                        placeholder="Password"
                        onChange={(e)=>setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mt-4"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 bg-[#ff6b9d] text-white font-semibold rounded-lg hover:bg-[#ffd93d] transition duration-200"
                    >
                    Login
                    </button>
                </form>
            </main>
        </div>
    );
}