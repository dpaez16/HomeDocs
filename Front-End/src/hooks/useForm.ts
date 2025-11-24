import { objectCompare } from "@/utils/objectCompare";
import { useEffect, useState } from "react";

interface UseFormParams<T extends object> {
    defaultValues: T;
    onSubmit: (formValues: T) => Promise<void>;
    validator?: (formValues: T) => boolean;
    isLoadingServerSideData?: boolean;
}

export function useForm<T extends object>(props: UseFormParams<T>) {
    const [formData, setFormData] = useState(() => ({ ...props.defaultValues }));
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (props.isLoadingServerSideData) {
            return;
        }

        const update = () => {
            setFormData({ ...props.defaultValues });
        };

        update();
    }, [props.isLoadingServerSideData]);

    const setValue = <K extends keyof T>(k: K, v: T[K]) => {
        setFormData(prev => ({
            ...prev,
            [k]: v,
        }));
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

    const isValid = props.validator ? props.validator(formData) : true;

    return {
        formData,
        isDirty: !objectCompare(formData, props.defaultValues),
        isSubmitting,
        isValid,
        setFormValue: setValue,
        resetForm: reset,
        submit,
    } as const;
}
