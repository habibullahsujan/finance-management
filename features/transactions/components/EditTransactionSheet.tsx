import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { insertTransactionSchema } from '@/database/schema'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import TransactionForm from './TransactionForm'
import { useEditTransactionSheet } from '../hooks/use-edit-transaction.sheet'
import { useGetTransaction } from '../api/use-get-transaction'
import { useEditTransaction } from '../api/use-edit-transaction'
import { useDeleteTransaction } from '../api/use-delete-transaction'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useConfirm } from '@/hooks/use-confirm'


const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>


const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useEditTransactionSheet()
    const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This is about delete this transaction')
    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)

    const categoriesQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
    const categoryOptions = (categoriesQuery?.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))


    const accountsQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({ name })
    const accountOptions = (accountsQuery?.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isPending || categoryMutation.isPending || accountMutation.isPending

    const isLoading = transactionQuery.isLoading || categoriesQuery.isLoading || accountsQuery.isLoading


    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, { onSuccess: () => { onClose() } })
        }
    }


    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }



    const defaultValues = transactionQuery?.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery?.data?.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,

    } : {
        date: new Date(),  // Default to the current date
        accountId: '',     // Empty string for accountId (required)
        categoryId: null,  // Null for nullable and optional field
        payee: '',         // Empty string for payee (required)
        amount: '',        // Empty string for amount (required as string)
        notes: null
    }


    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <Loader2 className='size-4 animate-spin text-muted-foreground' />
                            </div>) : <TransactionForm
                            key={id}
                            id={id}
                            onCreateAccount={onCreateAccount}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            categoryOptions={categoryOptions}
                            disabled={isPending}
                            onSubmit={onSubmit}
                            defaultValues={defaultValues}
                            onDelete={onDelete} />
                    }
                </SheetContent>
            </Sheet></>
    )
}

export default EditTransactionSheet