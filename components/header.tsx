'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useSession, signOut } from 'next-auth/react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            TechStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              Trang chủ
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition">
              Sản phẩm
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition">
              Về chúng tôi
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-primary transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {session?.user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {session.user.name || 'Profile'}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
            )}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
            >
              Sản phẩm
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
            >
              Về chúng tôi
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  {session.user.name || 'Profile'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded transition"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
              >
                <User className="w-4 h-4 inline mr-2" />
                Đăng nhập
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
