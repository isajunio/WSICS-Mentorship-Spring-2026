"use client"

import { useState } from "react";
import { PixelBackground } from "@/components/pixel-background";
import { supabase } from "@/lib/supabase-client.js";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();

        const { data: user } = await supabase
            .from("profiles")
            .select("email")
            .eq("username", username)
            .single();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: user?.email,
            password: password
        });

        if (error) {
            setErrorMsg("Invalid login credentials");
            return;
        }

        router.push('/');
    }

    const inputClass = "w-full px-5 py-4 text-base font-mono rounded-lg border-2 border-[#ff6b9d] bg-[#1a1a3e] text-white placeholder-[#8888aa] focus:outline-none focus:ring-2 focus:ring-[#ffd93d] focus:border-[#ffd93d] transition duration-200";

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <PixelBackground />
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
                <div className="text-center mb-10 max-w-2xl">
                    <p className="font-mono text-xs md:text-sm text-primary tracking-[0.3em] uppercase mb-4">
                        Find the Rhythm of Your Heart in
                    </p>
                    <h1
                        className="text-3xl md:text-5xl font-mono font-bold leading-tight mb-6"
                        style={{
                            background: 'linear-gradient(180deg, #ffd93d 0%, #ff8c42 50%, #ff6b9d 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(2px 2px 0 #000) drop-shadow(-1px -1px 0 #000)',
                        }}
                    >
                        PulsePlay
                    </h1>
                    <p className="text-muted-foreground font-sans text-xl md:text-2xl leading-relaxed">
                        Welcome back. Your heart has been waiting.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-4">
                    <input
                        name="username"
                        placeholder="Username"
                        className={inputClass}
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                        required
                    />
                    {errorMsg && (
                        <p className="font-mono text-xs text-red-400">{errorMsg}</p>
                    )}
                    <button
                        type="submit"
                        className="pixel-btn w-full font-mono text-sm font-bold border-2 transition-colors mt-2"
                        style={{
                            background: '#ff6b9d',
                            color: '#000',
                            borderColor: '#ff6b9d',
                            boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                            padding: '14px',
                        }}
                    >
                        LOGIN
                    </button>
                    <p className="font-mono text-xs text-center text-[#8888aa] mt-2">
                        Don&apos;t hxave an account?{" "}
                        <Link href="/signup" className="text-[#ff6b9d] hover:text-[#ffd93d] transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </form>
            </main>
        </div>
    );
}