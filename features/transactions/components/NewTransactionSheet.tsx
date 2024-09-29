
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { insertTransactionSchema } from '@/database/schema'

import { z } from 'zod'
import { useOpenTransactionSheet } from '../hooks/use-open-transaction-sheet'
import { useCreateTransaction } from '../api/use-create-transaction'
import TransactionForm from './TransactionForm'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { Loader2Icon } from 'lucide-react'






const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

const defaultValues = {
    date: new Date(),  // Default to the current date
    accountId: '',     // Empty string for accountId (required)
    categoryId: null,  // Null for nullable and optional field
    payee: '',         // Empty string for payee (required)
    amount: '',        // Empty string for amount (since it's a string here)
    notes: ''          // Empty string for notes (required)
};


const NewTransactionSheet = () => {

    const { isOpen, onClose } = useOpenTransactionSheet()
    const mutation = useCreateTransaction();


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

    const isPending = mutation.isPending || categoryMutation.isPending || accountMutation.isPending

    const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, { onSuccess: () => { onClose() } })
    }


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New transaction
                    </SheetTitle>
                    <SheetDescription>
                        Crate a new transaction to track your expenses.
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2Icon className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    ) : (
                        <TransactionForm
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                            defaultValues={defaultValues}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    )
}

export default NewTransactionSheet