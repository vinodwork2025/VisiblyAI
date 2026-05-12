'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center teal-glow group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">
            Cite<span className="text-primary">Check</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary">
            <Link href="/scan">Run Free Check</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-4"
        >
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMenuOpen(false)}>
            How it works
          </Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMenuOpen(false)}>
            Features
          </Link>
          <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMenuOpen(false)}>
            FAQ
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
            </Button>
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/scan" onClick={() => setMenuOpen(false)}>Run Free Check</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
