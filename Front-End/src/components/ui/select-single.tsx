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

interface SelectSingleProps {
    placeholder: string;
    searchPlaceholder: string;
    options: {
        label: string;
        value: string;
    }[];
    value: string | null;
    onValueChange: (newValue: string | null) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const SelectSingle: React.FC<SelectSingleProps> = (props) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const isLoading = !!props.isLoading;
    const disabled = !!props.disabled || isLoading;
    const label = props.value ? props.options.find(opt => opt.value === props.value)?.label : props.placeholder;

    const filteredOptions = props.options.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    disabled={disabled}
                >
                    {props.isLoading && <Spinner />}
                    {!props.isLoading && label}
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
                            {filteredOptions.map(opt => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(currentValue) => {
                                        props.onValueChange(currentValue === props.value ? null : currentValue);
                                        setInputValue("");
                                        setOpen(false);
                                    }}
                                >
                                  {opt.label}
                                  <Check
                                        className={cn(
                                            "ml-auto",
                                            props.value === opt.value ? "opacity-100" : "opacity-0",
                                        )}
                                  />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
