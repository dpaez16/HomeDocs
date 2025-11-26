import type { useForm } from "@/hooks/useForm";
import { Button } from "../button";
import { Spinner } from "../spinner";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
    form: ReturnType<typeof useForm>;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
    const { form } = props;

    return (
        <Button
            type='button'
            className={cn(props.className)}
            disabled={!form.isValid || !form.isDirty || form.isSubmitting || !!props.disabled}
            onClick={() => form.submit()}
        >
            {form.isSubmitting ? <Spinner /> : props.children}
        </Button>
    );
};
