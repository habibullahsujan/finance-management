import React from 'react'
import Logo from './Logo'
import Navigation from './Navigation'
import { UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { LoaderIcon } from 'lucide-react'
import WelcomeMsg from './WelcomeMsg'
import Filters from './Filters'

const Header = () => {
  return (
    <header className='bg-gradient-to-t from-blue-700 to-blue-500 px-4 py-8 lg:px-px-14 pb-36'>
      <div className="max-w-screen-2xl mx-auto">
        <div className='w-full flex items-center justify-between mb-14'>
          <div className='flex items-center lg:gap-x-16 '>
            <Logo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <LoaderIcon className='size-4 animate-spin text-muted-foreground' />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  )
}

export default Header