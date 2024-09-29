/* eslint-disable @next/next/no-async-client-component */
'use client'

import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { useOpenCategory } from '@/features/categories/hooks/use-open-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories'

const CategoriesPage = () => {

    const { onOpen } = useOpenCategory()
    const categoriesQuery = useGetCategories();
    const bulkDeleteCategories = useBulkDeleteCategories();

    const categories = categoriesQuery.data || [];

    const isDisabled = categoriesQuery.isLoading || bulkDeleteCategories.isPending

    if (categoriesQuery.isLoading) {
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
                        Categories Page
                    </CardTitle>
                    <Button size="sm" onClick={onOpen}>
                        <Plus className='size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={categories} filterKey='name' disabled={isDisabled} onDelete={(row) => {
                        const ids = row.map((r) => r.original.id)
                        bulkDeleteCategories.mutate({ ids })
                    }} />
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriesPage