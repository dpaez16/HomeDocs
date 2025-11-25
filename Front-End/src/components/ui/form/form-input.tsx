import React from "react";
import { Input } from "../input";
import { Label } from "../label";

export interface FormInputProps extends React.ComponentProps<"input"> {
    id: string;
    label: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>((props, ref) => {
    return (
        <>
            <Label htmlFor={props.id}>{props.label}</Label>
            <Input
                ref={ref}
                {...props}
            />
        </>
    );
});
