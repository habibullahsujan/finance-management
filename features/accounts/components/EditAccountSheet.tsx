import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import AccountForm from './AccountForm'
import { insertAccountSchema } from '@/database/schema'
import { z } from 'zod'
import { useEditAccount } from '@/features/accounts/hooks/use-edit-account'
import { useGetAccount } from '@/features/accounts/api/use-get-account'
import { Loader2 } from 'lucide-react'
import { useEditAccountDB } from '@/features/accounts/api/use-edit-accountDB'
import { useDeleteAccountDB } from '@/features/accounts/api/use-delete-account'
import { useConfirm } from '@/hooks/use-confirm'


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>


const EditAccountSheet = () => {

    const { isOpen, onClose, id } = useEditAccount()
    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This is about delete this transaction')
    const account = useGetAccount(id)
    const editMutation = useEditAccountDB(id)
    const deleteAccount = useDeleteAccountDB(id)


    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, { onSuccess: () => { onClose() } })
    }
    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteAccount.mutate(undefined, { onSuccess: () => { onClose() } })
        }
    }

    const isPending = editMutation.isPending || deleteAccount.isPending
    const defaultValues = account?.data ? { name: account?.data?.name } : { name: '' }


    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        account.isLoading ? (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <Loader2 className='size-4 animate-spin text-muted-foreground' />
                            </div>) : <AccountForm id={id} onSubmit={onSubmit} defaultValues={defaultValues} disabled={isPending} onDelete={onDelete} />
                    }
                </SheetContent>
            </Sheet></>
    )
}

export default EditAccountSheet