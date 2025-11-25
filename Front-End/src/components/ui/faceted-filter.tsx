import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button, buttonVariants } from './button';
import { Separator } from './separator';
import { Badge } from './badge';
import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Checkbox } from './checkbox';
import type { VariantProps } from 'class-variance-authority';
import { Input } from './input';

interface FacetedFilterProps {
    title?: string;
    disabled?: boolean;
    options?: {
        label: string;
        value: string;
        count?: number; // Optional count of items, replacing faceted count
    }[];
    icon?: React.ReactNode;
    selectedValues: Set<string>;
    setSelectedValues: (values: Set<string>) => void;
    size?: VariantProps<typeof buttonVariants>['size'];
    // The component uses an internal filter text state if these are not provided
    filterText?: string; // Controlled filter text
    setFilterText?: (text: string) => void; // Controlled filter text setter
}

export function FacetedFilter({
    title,
    selectedValues,
    setSelectedValues,
    icon,
    options = [],
    size = 'sm',
    disabled,
    filterText: controlledFilterText,
    setFilterText: setControlledFilterText,
}: FacetedFilterProps) {
    const [internalFilterText, setInternalFilterText] = useState('');
    const filterText = controlledFilterText !== undefined ? controlledFilterText : internalFilterText;
    const setFilterText = setControlledFilterText !== undefined ? setControlledFilterText : setInternalFilterText;

    const toggleSelection = (value: string) => {
        const newSelectedValues = new Set(selectedValues);
        if (newSelectedValues.has(value)) {
            newSelectedValues.delete(value);
        } else {
            newSelectedValues.add(value);
        }
        setSelectedValues(newSelectedValues);
    };

    const clearFilters = () => {
        setSelectedValues(new Set());
    };

    const filteredOptions = options
        .filter(option => !!option.label)
        .filter(option =>
            option.label.toString().toLowerCase().includes(filterText.toLowerCase().trim())
        );

    const renderOptions = ()  => {
        if (filteredOptions.length === 0) {
            return <div className='text-center text-primary p-2 text-sm'>No results found</div>;
        }

        const opts = filteredOptions.sort((a, b) => a.label.toString().localeCompare(b.label.toString())).slice(0, 100);



        return opts.map(option => {
            const isSelected = selectedValues?.has(option.value);
            return (
                <Button
                    key={option.value}
                    variant='ghost'
                    className={cn(
                        'justify-start rounded-none',
                        isSelected ? 'text-primary' : 'text-primary',
                        'flex flex-row gap-4 items-center'
                    )}
                    onClick={() => toggleSelection(option.value)}
                >
                    <Checkbox checked={isSelected} className='mr-2' />
                    <span className='text-sm'>{option.label}</span>
                    {option.count !== undefined && <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {option.count || 0}
                    </span>}
                </Button>
            );
        });
    };



    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" disabled={disabled} size={size} className="h-8 border-dashed text-primary w-full sm:w-auto">
                    <div className='mr-2'>
                        {icon ?? <PlusCircleIcon className="h-4 w-4" />}
                    </div>
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <div className="space-x-1 flex">
                                {selectedValues.size > 2 ? (
                                    <Badge variant="default" className="rounded-sm px-1 font-normal">
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    filteredOptions.filter(option => selectedValues.has(option.value))
                                        .map(option => (
                                            <Badge variant="default" key={option.value} className="rounded-sm px-1 font-normal">
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                <div className='text-sm w-full p-2 pb-0 flex flex-row items-center'>
                    <SearchIcon className='text-primary mr-2' size={18} />
                    <Input
                        className='border-none w-full outline-none text-primary'
                        placeholder={`Search ${title}...`}
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>
                <Separator orientation='horizontal' className='my-2' />
                <div className='w-full flex flex-col'>
                    <div className='flex flex-col overflow-y-auto max-h-[275px]'>
                        {options.length > 100 && <div className='text-center text-secondary p-2 text-xs'>Showing first 100 results</div>}
                        {renderOptions()}
                    </div>
                    <Separator orientation='horizontal' className='mt-2' />
                    <Button variant={'ghost'} disabled={selectedValues?.size === 0} onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
