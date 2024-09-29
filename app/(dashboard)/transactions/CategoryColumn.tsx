import { useEditCategorySheet } from '@/features/categories/hooks/use-edit-category-sheet';
import { useEditTransactionSheet } from '@/features/transactions/hooks/use-edit-transaction.sheet';
import { cn } from '@/lib/utils';
import { TriangleIcon } from 'lucide-react';
import React from 'react'


type Props = {
    id: string | null;
    categoryId: string | null;
    category: string | null;

}
const CategoryColumn = ({ id, categoryId, category }: Props) => {
    const { onOpen } = useEditCategorySheet()
    const { onOpen: onOpenTransaction } = useEditTransactionSheet()



    const onClick = () => {
        if (categoryId) {

            onOpen(categoryId as string)
        } else {
            onOpenTransaction(id as string)
        }
    }


    return (
        <div onClick={onClick} className={cn('flex items-center cursor-pointer hover:underline', !categoryId && 'text-rose-500')}>
            {!category && <TriangleIcon className='mr-2 shrink-0' />}
            {category || 'Uncategorized'}
        </div>
    )
}

export default CategoryColumn