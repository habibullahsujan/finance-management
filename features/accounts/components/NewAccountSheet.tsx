import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { insertAccountSchema } from '@/database/schema'
import { z } from 'zod'

import AccountForm from './AccountForm'

import { useOpenAccount } from '../hooks/use-open-account'
import { useCreateAccount } from '../api/use-create-account'


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>


const NewAccountSheet = () => {
    const { isOpen, onClose } = useOpenAccount()
    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {

        mutation.mutate(values, { onSuccess: () => { onClose() } })
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Crate a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: '' }} />
            </SheetContent>

        </Sheet>
    )
}

export default NewAccountSheet