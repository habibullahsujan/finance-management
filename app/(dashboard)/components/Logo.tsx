import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href={'/'}>
            <div className='hidden lg:flex items-center'>
                <Image src={'/logo.svg'} alt='logo' width={28} height={28} />
                <p className='font-semibold text-2xl ml-2.5 text-white'>Finance</p>
            </div>
        </Link>
    )
}

export default Logo