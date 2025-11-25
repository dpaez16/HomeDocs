import React from "react";
import { Checkbox } from "../checkbox";
import { Label } from "../label";
import type { CheckboxProps } from "@radix-ui/react-checkbox";
import { SimpleTooltip } from "../simple-tooltip";

export interface FormCheckboxProps extends CheckboxProps {
    id: string;
    label: React.ReactNode;
    helpMessage?: string;
}

export const FormCheckbox = React.forwardRef<HTMLButtonElement, FormCheckboxProps>((props, ref) => {
    return (
        <div className='flex items-center gap-2'>
            <Checkbox
                {...props}
                ref={ref}
            />
            <SimpleTooltip text={props.helpMessage}>
                <Label htmlFor={props.id}>{props.label}</Label>
            </SimpleTooltip>
        </div>
    );
});
