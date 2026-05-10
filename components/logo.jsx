'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Logo({src}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 transition-all duration-300 "
    >
      {/* Logo Image */}
      <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10">
        <Image
          src={src || "/logo.png"}
          alt="StudentOS Logo"
          fill
          className="object-contain "
          priority
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col leading-none">
        <h1 className="text-xl font-black tracking-tight font-sans ">
          স্টুডেন্ট <span className="text-primary">ওএস</span>
        </h1>

       
      </div>
    </Link>
  )
}