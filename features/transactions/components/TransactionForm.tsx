'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../../components/ui/form'
import { Button } from '../../../components/ui/button'
import { TrashIcon } from 'lucide-react'
import { insertTransactionSchema } from '@/database/schema'
import CustomSelect from '@/components/CustomSelect'
import DatePicker from '@/components/DatePicker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import AmountInput from '@/components/AmountInput'
import { convertAmountToMiliunits } from '@/lib/utils'


const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
})

const apiSchema = insertTransactionSchema.omit({
    id: true
})
type FormValues = z.input<typeof formSchema>
type ApiFromValues = z.input<typeof apiSchema>


type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFromValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    categoryOptions: { label: string, value: string }[];
    accountOptions: { label: string, value: string }[];
    onCreateCategory: (name: string) => void;
    onCreateAccount: (name: string) => void
}

const TransactionForm = ({ id, defaultValues, onSubmit, onDelete, disabled, accountOptions, categoryOptions, onCreateAccount, onCreateCategory }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountInMiliunit = convertAmountToMiliunits(amount)

        onSubmit({
            ...values,
            amount: amountInMiliunit
        })
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
                <FormField
                    name='date'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker
                                    disabled={disabled}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='accountId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <CustomSelect
                                    placeholder='Select an account'
                                    options={accountOptions}
                                    onCreate={onCreateAccount}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}

                                />

                            </FormControl>

                        </FormItem>

                    )}
                />
                <FormField
                    name='categoryId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <CustomSelect
                                    placeholder='Select an category'
                                    options={categoryOptions}
                                    onCreate={onCreateCategory}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='payee'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payee</FormLabel>
                            <FormControl>
                                <Input disabled={disabled} {...field} placeholder='Add a payee' />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='amount'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput disabled={disabled} {...field} value={field.value} onChange={field.onChange} placeholder='Enter amount' />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='notes'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    disabled={disabled}
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder='Optional notes'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className='w-full' type='submit' >{id ? 'Save changes' : "Create transaction"}</Button>
                {
                    !!id && <Button
                        className='w-full'
                        variant={'outline'}
                        onClick={handleDelete}
                        disabled={disabled}
                        type='button'
                    >
                        <TrashIcon className='size-4 mr-2' />
                        Delete account
                    </Button>
                }
            </form>
        </Form>
    )
}

export default TransactionForm