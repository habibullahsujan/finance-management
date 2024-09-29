
import { useMemo } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Props = {
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    options?: { label: string, value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
}
const CustomSelect = ({ onChange, onCreate, options, value, disabled, placeholder }: Props) => {

    const onSelect = (option: SingleValue<{ label: string, value: string }>) => {
        onChange(option?.value)
    }

    const formattedValue = useMemo(() => {
        return options?.find((option) => option.value === value)
    }, [options, value])

    return (
        <CreatableSelect
            className='text-sm h-10'
            styles={{
                control: (base) => ({ ...base, borderColor: '#e2e8f0', ":hover": { borderColor: '#e2e8f0' } }),
            }}
            onCreateOption={onCreate}
            onChange={onSelect}
            options={options}
            value={formattedValue}
            isDisabled={disabled}
            placeholder={placeholder} />
    )
}

export default CustomSelect