'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import NavButton from './NavButton'
import {useMedia} from 'react-use'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const routes = [
    {
        href: '/',
        label: 'Overview'
    }, {
        href: '/transactions',
        label: 'Transactions'
    },
    {
        href: '/accounts',
        label: 'Accounts'
    },
    {
        href: '/category',
        label: 'Category'
    },
    {
        href: '/settings',
        label: 'Settings'
    }
]
const Navigation = () => {
    const[open,setOpen] =useState(false);
    const router=useRouter();
    const isMobile=useMedia("(max-width: 1024px)",false);
    const pathName = usePathname();

    const onClick=(href:string)=>{
        router.push(href)
        setOpen(false)
    }

    if(isMobile){
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Button className='font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition' variant={'outline'} size='sm' >
                    <Menu className='size-4'/>
                    </Button>
                </SheetTrigger>
                <SheetContent side='left' className='px-2'>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {
                            routes.map(({ href, label }) => (
                                <Button key={href} onClick={()=>onClick(href)} className=' w-full justify-start'
                                variant={pathName===href?'secondary':'ghost'}

                                >
                                    {label}
                                </Button>
                            ))
                        }
                    </nav>

                </SheetContent>

            </Sheet>
        )
    }
    return (
        <nav className='hidden lg:flex gap-x-2 overflow-x-auto items-center text-white'>
            {routes.map(({ href, label }) => (
                <NavButton key={href} href={href} label={label} isActive={pathName === href} />
            ))}
        </nav>
    )
}

export default Navigation