import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useConfirm } from '@/hooks/use-confirm'
import { useDeleteCategory } from '@/features/categories/api/use-delete-category'
import { useEditCategorySheet } from '@/features/categories/hooks/use-edit-category-sheet'
import { EditIcon, MoreHorizontal, Trash } from 'lucide-react'
import React from 'react'

const Actions = ({ id }: { id: string }) => {

    const deleteMutation = useDeleteCategory(id)
    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This is about delete this transaction.')



    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, { onSuccess: () => { } })
        }
    }

    const { onOpen } = useEditCategorySheet()

    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='size-8 p-0' variant={'ghost'}>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}>
                        <EditIcon className='size-4 mr-2' />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={onDelete}>
                        <Trash className='size-4 mr-2' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Actions