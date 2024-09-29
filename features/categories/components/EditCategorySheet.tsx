import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import AccountForm from './CategoryForm'
import { insertAccountSchema } from '@/database/schema'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useConfirm } from '@/hooks/use-confirm'
import { useEditCategorySheet } from '../hooks/use-edit-category-sheet'
import { useGetCategory } from '../api/use-get-category'
import { useEditCategory } from '../api/use-edit-category'
import { useDeleteCategory } from '../api/use-delete-category'


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>


const EditCategorySheet = () => {

    const { isOpen, onClose, id } = useEditCategorySheet()
    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This is about delete this transaction')
    const category = useGetCategory(id)
    const editMutation = useEditCategory(id)
    const deleteCategory = useDeleteCategory(id)


    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, { onSuccess: () => { onClose() } })
    }
    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteCategory.mutate(undefined, { onSuccess: () => { onClose() } })
        }
    }

    const isPending = editMutation.isPending || deleteCategory.isPending
    const defaultValues = category?.data ? { name: category?.data?.name } : { name: '' }


    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        category.isLoading ? (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <Loader2 className='size-4 animate-spin text-muted-foreground' />
                            </div>) : <AccountForm id={id} onSubmit={onSubmit} defaultValues={defaultValues} disabled={isPending} onDelete={onDelete} />
                    }
                </SheetContent>
            </Sheet></>
    )
}

export default EditCategorySheet