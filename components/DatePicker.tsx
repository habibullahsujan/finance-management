import React, { } from 'react'
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar as CalenderIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';


type Props = {
  value?: Date;
  onChange?: (value: Date) => void;
  disabled?: boolean
}


const DatePicker = ({ value, onChange, disabled }: Props) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant={'outline'} className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}>
          <CalenderIcon className='mr-2 size-4' />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DayPicker
          required
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker