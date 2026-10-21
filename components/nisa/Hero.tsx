"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="relative w-full bg-[#F5F3EC] text-[#171916] font-sans transition-colors duration-200 overflow-hidden">
      {/* ==========================================
          ARKA PLAN GÖRSELİ VE FADE (NAVBAR & HERO ALANI)
         ========================================== */}
      <div className="absolute top-0 left-0 right-0 h-full max-h-[620px] md:max-h-[720px] z-0 pointer-events-none overflow-hidden">
        {/* Arka Plan Görseli */}
        <Image
          src="/students/nisa/campus-bg.png"
          alt="Üsküdar Üniversitesi Arka Plan"
          fill
          priority
          className="object-cover opacity-65"
        />
        {/* En Üstü Şeffaf, Alta Doğru Tatlıca Solan Katman */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F3EC]/40 to-[#F5F3EC]" />
      </div>

      {/* ==========================================
          1. NAVIGATION BAR (Baskın Beyazlık Kaldırıldı)
         ========================================== */}
      <nav
        aria-label="Main Navigation"
        className="w-full bg-[#F5F3EC]/20 backdrop-blur-sm sticky top-0 z-50 transition-all"
      >
        {/* Üst Navigation Alanı & Alt Çizgi */}
        <div className="border-b border-[#171916]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[140px] flex items-center justify-between">

            {/* Logo ve Brand İsmi */}
            <div className="flex items-center gap-6 ml-4 sm:ml-8 lg:ml-12">
              <Image
                src="/students/nisa/club-logo.png"
                alt="AISS Club Logo"
                width={108}
                height={108}
                className="w-27 h-27 md:w-27 md:h-27 rounded-full object-cover border border-[#171916]/10 shadow-md transition-transform hover:scale-105"
              />
              <a
                href="#home"
                className="group flex items-center gap-2 text-2xl sm:text-5xl lg:text-6xlfont-black tracking-tight text-[#171916] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171916] rounded-sm"
              >
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg lg:text-xl font-bold text-[#1E2A5A] hover:opacity-75 hover:scale-105 transition-all tracking-wide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2A5A] rounded-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-[#1E2A5A] hover:bg-[#DCDDD3]/50 focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle Navigation Menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#DCDDD3] bg-[#F5F3EC]/90 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-[#1E2A5A] hover:opacity-75 py-1 focus-visible:outline-2 focus-visible:outline-[#1E2A5A]"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ==========================================
          2. HERO SECTION
         ========================================== */}
      <section
        id="home"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 scroll-mt-24"
      >
        <div className="max-w-4xl space-y-8">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#1E2A5A] leading-[1.1]">
            Bridging academic curiosity with real-world A impact.</h1>          <p className="text-base sm:text-lg text-[#1E2A5A] max-w-2xl leading-relaxed font-medium">
            A community of undergraduate engineers and researchers collaborating to push the boundaries of AI through hands-on development.
          </p>

          {/* Call to Action Links */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#events"
              className="px-6 py-3 text-sm font-semibold text-white bg-[#1E2A5A] border border-[#171916] rounded-md shadow-[3px_3px_0px_0px_#171916] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
            >
              Explore Events
            </a>
            <a
              href="#about"
              className="px-6 py-3 text-sm font-semibold text-[#171916] bg-[#FFFFFF] border border-[#DCDDD3] rounded-md hover:bg-[#DCDDD3]/30 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171916]"
            >
              Read About Us
            </a>
          </div>

        </div>
      </section>
    </header>
  );
}
