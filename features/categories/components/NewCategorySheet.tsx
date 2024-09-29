import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { insertAccountSchema } from '@/database/schema'
import { z } from 'zod'
import CategoryForm from './CategoryForm'
import { useOpenCategory } from '../hooks/use-open-category'
import { useCreateCategory } from '../api/use-create-category'


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>


const NewCategorySheet = () => {
    const { isOpen, onClose } = useOpenCategory()

    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues) => {

        mutation.mutate(values, { onSuccess: () => { onClose() } })
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Crate a new category to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: '' }} />
            </SheetContent>
        </Sheet>
    )
}

export default NewCategorySheet