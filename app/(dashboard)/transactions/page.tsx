/* eslint-disable @next/next/no-async-client-component */
'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { useOpenTransactionSheet } from '@/features/transactions/hooks/use-open-transaction-sheet'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-deelete-transactions'
import UploadButton from './UploadButton'
import ImportCard from './ImportCard'
import { transactions as transactionsSchema } from '@/database/schema'
import { useSelectAccount } from '@/features/transactions/hooks/use-confirm'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}
const initialImportResult = {
    data: [],
    errors: [],
    meta: {}
}


const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount()
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
    const [importResults, setImportResults] = useState(initialImportResult)
    const { onOpen } = useOpenTransactionSheet()

    const transactionsQuery = useGetTransactions();
    const bulkDeleteTransactions = useBulkDeleteTransactions();
    const bulkCreateTransactions = useBulkCreateTransactions()

    const transactions = transactionsQuery.data || [];
    const isDisabled = transactionsQuery.isLoading || bulkDeleteTransactions.isPending
    const onUpload = (results: typeof initialImportResult) => {
        setImportResults(results)
        setVariant(VARIANTS.IMPORT)
    }
    const onCancelImport = () => {
        setImportResults(initialImportResult)
        setVariant(VARIANTS.LIST)
    }


    const onSubmitImport = async (values: typeof transactionsSchema.$inferInsert[]) => {
        const accountId = await confirm();

        if (!accountId) {
            return toast.error('Please select an account to continue.')
        }
        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string
        }))
        bulkCreateTransactions.mutate(data, {
            onSuccess: () => {
                toast.success('Transactions imported successfully'),
                    onCancelImport()
            }
        })

    }


    if (transactionsQuery.isLoading) {
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
    if (variant === VARIANTS.IMPORT) {
        return (
            <div>
                <AccountDialog />
                <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
            </div>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm '>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Transactions Page
                    </CardTitle>
                    <div className="flex item-center gap-x-2">
                        <Button size="sm" onClick={onOpen}>
                            <Plus className='size-4 mr-2' />
                            Add new
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        filterKey='name'
                        disabled={isDisabled}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            bulkDeleteTransactions.mutate({ ids })
                        }} />
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsPage