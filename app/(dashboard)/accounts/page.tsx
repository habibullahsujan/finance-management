/* eslint-disable @next/next/no-async-client-component */
'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { useCreateAccount } from '@/features/accounts/hooks/use-create-account'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { useGetAccounts } from '@/features/accounts/user-get-accounts'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteAccounts } from '@/features/accounts/use-bulk-delete'

const AccountsPage = () => {

    const { onOpen } = useCreateAccount()
    const accountsQuery = useGetAccounts();
    const bulkDeleteAccounts = useBulkDeleteAccounts();

    const accounts = accountsQuery.data || [];

    const isDisabled = accountsQuery.isLoading || bulkDeleteAccounts.isPending

    if (accountsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm '>
                    <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">

                            <Loader2 className='size-6 text-slate-600 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm '>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        AccountsPage
                    </CardTitle>
                    <Button size="sm" onClick={onOpen}>
                        <Plus className='size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={accounts} filterKey='email' disabled={isDisabled} onDelete={(row) => {
                        const ids = row.map((r) => r.original.id)
                        bulkDeleteAccounts.mutate({ ids })
                    }} />
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountsPage