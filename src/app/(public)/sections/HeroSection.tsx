"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Heart, Trophy, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto section-padding text-center">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 bg-carbon-800 border border-gold/30 rounded-full px-4 py-2 mb-8"
          style={{ animation: "fadeUp 0.6s ease forwards", animationDelay: "0ms", opacity: 0 }}
        >
          <Heart className="w-3.5 h-3.5 text-gold fill-gold" />
          <span className="text-xs font-mono text-gold tracking-widest uppercase">
            Golf with Purpose
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-none mb-6"
          style={{ animation: "fadeUp 0.6s ease forwards", animationDelay: "100ms", opacity: 0 }}
        >
          <span className="text-white">Play.</span>{" "}
          <span className="text-gradient-gold">Give.</span>{" "}
          <span className="text-white">Win.</span>
        </h1>

        <p
          className="text-lg md:text-xl text-carbon-300 max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ animation: "fadeUp 0.6s ease forwards", animationDelay: "200ms", opacity: 0 }}
        >
          Track your golf scores. Enter monthly prize draws. Support the charity you love.
          Every subscription makes a difference — on and off the course.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeUp 0.6s ease forwards", animationDelay: "300ms", opacity: 0 }}
        >
          <Link href="/signup">
            <Button size="lg" className="animate-pulse-gold group">
              Start for £9.99/month
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="ghost">See how it works</Button>
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16"
          style={{ animation: "fadeUp 0.6s ease forwards", animationDelay: "400ms", opacity: 0 }}
        >
          {[
            { icon: Trophy, value: "£50K+", label: "Prizes Won" },
            { icon: Heart, value: "£12K+", label: "Charity Raised" },
            { icon: TrendingUp, value: "2,400+", label: "Members" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="w-5 h-5 text-gold mb-1" />
              <span className="font-display font-bold text-2xl text-white">{value}</span>
              <span className="text-xs text-carbon-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-carbon-950 to-transparent" />
    </section>
  );
}
