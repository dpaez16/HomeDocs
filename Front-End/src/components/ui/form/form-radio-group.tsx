import React from "react";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";

export interface FormRadioGroupProps {
    label: React.ReactNode;
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: (newValue: string) => void;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = (props) => {
    return (
        <div className='flex flex-col gap-4'>
            <Label>{props.label}</Label>
            <RadioGroup
                value={props.value}
                onValueChange={props.onChange}
            >
                {
                    props.options.map(o => {
                        return (
                            <div className="flex items-center space-x-2" key={o.value}>
                                <RadioGroupItem value={o.value} id={o.value} />
                                <Label htmlFor={o.value}>{o.label}</Label>
                            </div>
                        );
                    })
                }
            </RadioGroup>
        </div>
    );
};
