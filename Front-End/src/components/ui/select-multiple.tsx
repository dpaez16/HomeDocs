"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "./spinner"
import { Badge } from "./badge"

interface SelectMultipleProps {
    placeholder: string;
    searchPlaceholder: string;
    options: {
        label: string;
        value: string;
    }[];
    values: string[];
    onChange: (newValues: string[]) => void;
    isLoading?: boolean;
    disabled?: boolean;
    previewItemsCutoffLimit?: number;
}

export const SelectMultiple: React.FC<SelectMultipleProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const isLoading = !!props.isLoading;
    const disabled = !!props.disabled || isLoading;

    const filteredOptions = props.options.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()));

    const displayLimit = props.previewItemsCutoffLimit ?? 5;
    const remaining = props.values.length - displayLimit;

    const badges = props.values
        .map(val => props.options.find(opt => opt.value === val)?.label)
        .filter(label => label !== undefined)
        .map(v => (<Badge key={v}>{v}</Badge>));

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (!isOpen) {
            setInputValue("");
        }
    };

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {props.isLoading && <Spinner />}
                    {
                        !props.isLoading && props.values.length > 0 &&
                        <div className='flex gap-2'>
                            {badges.slice(0, displayLimit)}
                                {remaining > 0 && <Badge>{`+${remaining}`}</Badge>}
                        </div>
                    }
                    {
                        !props.isLoading && props.values.length === 0 &&
                        props.placeholder
                    }
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={props.searchPlaceholder}
                        className="h-9"
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        <CommandGroup>
                            {filteredOptions.map(opt => {
                                const isSelected = props.values.find(v => v === opt.value) !== undefined;
                                return (
                                    <CommandItem
                                        key={opt.value}
                                        value={opt.value}
                                        onSelect={(currentValue) => {
                                            if (isSelected) {
                                                props.onChange(props.values.filter(v => v !== currentValue));
                                            } else {
                                                props.onChange([...props.values, opt.value]);
                                            }
                                        }}
                                    >
                                      {opt.label}
                                      <Check
                                            className={cn(
                                                "ml-auto",
                                                isSelected ? "opacity-100" : "opacity-0",
                                            )}
                                      />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        <CommandGroup>
                            <CommandItem
                                className='border-t-2'
                                onSelect={() => {
                                    props.onChange([]);
                                    setOpen(false);
                                    setInputValue("");
                                }}
                            >
                                Clear Selection
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
