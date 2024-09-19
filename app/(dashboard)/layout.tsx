import React from 'react'
import Header from './(components)/Header'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <main className='px-4 lg:px-8'>
                {children}
            </main>
        </>
    )
}

export default DashboardLayout