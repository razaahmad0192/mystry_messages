"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { Menu, X, Home, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react'

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleSignOut = () => {
        signOut();
        closeMenu();
    };

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 shadow-sm'>
            <div className='container mx-auto px-4 py-4 md:px-6 md:py-4'>
                <div className='flex items-center justify-between'>
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className='text-2xl md:text-3xl font-bold text-gray-300'
                        onClick={closeMenu}
                    >
                        Mystry Messages
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-4'>
                        {session ? (
                            <>
                                <div className='flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-700'>
                                    <UserIcon className='h-4 w-4 text-gray-300' />
                                    <span className='text-sm font-medium text-gray-200'>
                                        @{user?.username || user?.email?.split('@')[0]}
                                    </span>
                                </div>
                                <Link href="/" onClick={closeMenu}>
                                    <Button variant="ghost" className='gap-2 text-white hover:bg-gray-700'>
                                        <Home className='h-4 w-4' />
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/dashboard" onClick={closeMenu}>
                                    <Button variant="ghost" className='gap-2 text-white hover:bg-gray-700'>
                                        <LayoutDashboard className='h-4 w-4' />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    onClick={handleSignOut}
                                    className='gap-2  border-gray-900 text-gray-900 hover:bg-red-200/30'
                                >
                                    <LogOut className='h-4 w-4' />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href={'/sign-in'}>
                                <Button className='gap-2'>
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className='md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className='h-6 w-6 text-white' />
                        ) : (
                            <Menu className='h-6 w-6 text-white' />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className='md:hidden mt-4 pb-4 border-t border-gray-700 pt-4'>
                        {session ? (
                            <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 mb-2'>
                                    <UserIcon className='h-4 w-4 text-gray-300' />
                                    <span className='text-sm font-medium text-gray-200'>
                                        @{user?.username || user?.email?.split('@')[0]}
                                    </span>
                                </div>
                                <Link href="/" onClick={closeMenu}>
                                    <Button variant="ghost" className='w-full justify-start gap-2 text-white hover:bg-gray-700'>
                                        <Home className='h-4 w-4' />
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/dashboard" onClick={closeMenu}>
                                    <Button variant="ghost" className='w-full justify-start gap-2 text-white hover:bg-gray-700'>
                                        <LayoutDashboard className='h-4 w-4' />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    onClick={handleSignOut}
                                    className='w-full justify-start gap-2 border-gray-900 text-gray-900 hover:bg-red-200/30'
                              
                                >
                                    <LogOut className='h-4 w-4' />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href={'/sign-in'} onClick={closeMenu}>
                                <Button className='w-full gap-2'>
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
