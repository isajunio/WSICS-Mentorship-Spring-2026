"use client"

import { useState, useEffect } from "react";
import { PixelBackground } from "@/components/pixel-background";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header"

export default function Signup() {
    return(
        <div className="min-h-screen flex flex-col relative overflow-hidden">
             <PixelBackground />
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20 relative z-10">
            <Header />

            {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <p className="font-mono text-xs md:text-sm text-primary tracking-[0.3em] uppercase mb-4">
            Find the Rhythm of Your Heart in 
          </p>
          <h1
            className="text-3xl md:text-5xl font-mono font-bold leading-tight mb-6 text-balance"
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
            Enter a username and password to get started. We promise not to play with your heart {"<3"}
          </p>
        </div>
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
                    className="pixel-btn w-full py-2 font-mono text-xs font-bold border-2 transition-colors"
                style={{
                    background: '#ff6b9d',
                    color: '#000',
                    borderColor: '#ff6b9d',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                    padding: '10px', 
                    marginTop: '20px',
                    justifyContent: 'center',
                    alignItems:'center',
                    display: 'flex'
                }}>
                    Sign Up
                </button>
            </form>

            </main>
        </div>
    );
}