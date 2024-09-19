import { insertAccountSchema } from '@/database/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { TrashIcon } from 'lucide-react'


const formSchema = insertAccountSchema.pick({
    name: true
})

type FormValues = z.input<typeof formSchema>

const zodSchema=z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),

})
type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean
}
const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(zodSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handleDelete = () => {
        onDelete?.()
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
                <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={disabled} {...field} placeholder='e.g Cash, Bank, Credit Card' />

                            </FormControl>
                            {form.formState.errors.name && (
                                <FormMessage>
                                    {form.formState.errors.name.message}
                                </FormMessage>
                            )}
                        </FormItem>

                    )}


                />

                <Button className='w-full' type='submit' disabled={disabled}>{id ? 'Save changes' : "Create account"}</Button>
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

export default AccountForm