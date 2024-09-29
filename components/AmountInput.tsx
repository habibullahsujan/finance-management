import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}
const AmountInput = ({ value, onChange, placeholder, disabled }: Props) => {
    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;
    const onReverseValue = () => {
        if (!value) return
        onChange((parseFloat(value) * -1).toString())
    }
    return (
        <div className='relative'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type='button' onClick={onReverseValue} className={cn('bg-slate-400 hover:bg-slate-500 absolute top-1 left-1.5 rounded-md p-2 flex items-center  justify-center transition', isIncome && 'bg-emerald-500 hover:bg-emerald-600', isExpense && 'bg-rose-500 hover:bg-rose-600')} >

                            {!parsedValue && <Info className='size-3 text-white' />}
                            {isIncome && <PlusCircle className='size-3 text-white' />}
                            {isExpense && <MinusCircle className='size-3 text-white' />}
                        </button>

                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expense
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput placeholder={placeholder} disabled={disabled} value={value} onValueChange={onChange} prefix='$' className='pl-10 flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300' decimalsLimit={2} />
            <p className='text-xs text-muted-foreground mt-2'>
                {isIncome && 'This will count as income'}
                {isExpense && 'This will count as expense'}
            </p>

        </div>
    )
}

export default AmountInput