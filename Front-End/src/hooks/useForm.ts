import { useState } from "react";

interface UseFormParams<T extends object> {
    defaultValues: T;
    onSubmit: (formValues: T) => Promise<void>;
}

export function useForm<T extends object>(props: UseFormParams<T>) {
    const [formData, setFormData] = useState({ ...props.defaultValues });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getValue = <K extends keyof T>(k: K) => {
        return formData[k];
    };

    const setValue = <K extends keyof T>(k: K, v: T[K]) => {
        setFormData({
            ...formData,
            [k]: v,
        });
    };

    const reset = () => {
        setFormData({ ...props.defaultValues });
    };

    const submit = () => {
        setIsSubmitting(true);

        props.onSubmit(formData)
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return {
        formData,
        isDirty: JSON.stringify(formData) !== JSON.stringify(props.defaultValues),
        isSubmitting,
        getFormValue: getValue,
        setFormValue: setValue,
        resetForm: reset,
        submit,
    } as const;
}

