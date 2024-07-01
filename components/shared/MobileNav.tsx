"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { navLinks } from '@/constants'

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className='header'>
      <Link href="/" className='flex items-center gap-2 md:py-2'>
        <Image src="/assets/images/SnapGen2.svg" alt="logo" width={180} height={28}></Image>
      </Link>
      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>
        <Sheet>
          <SheetTrigger>
            <Image src="/assets/icons/menu.svg" alt="menu" width={32} height={32} className='cursor-pointer'></Image>
          </SheetTrigger>
          <SheetContent className='sheet-content sm:w-64'>
            <Image src="/assets/images/SnapGen2.svg" alt="menu" width={152} height={23} className='cursor-pointer'></Image>
            <SignedIn>
            <ul className='header-nav_elements'>
              {navLinks.map((link) => {
                const isActive = link.route === pathname
                return (
                  <li key={link.route} 
                  className={`${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                    } w-full`
                    }>
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt='logo'
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            </SignedIn>
            <SignedOut>
          <Button asChild className='button bg-purple-gradient bg-cover'>
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export default MobileNav