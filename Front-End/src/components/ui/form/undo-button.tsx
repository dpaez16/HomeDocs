import type { useForm } from "@/hooks/useForm";
import { Button } from "../button";
import { Spinner } from "../spinner";
import { cn } from "@/lib/utils";

interface UndoButtonProps {
    form: ReturnType<typeof useForm>;
    className?: string;
    children: React.ReactNode;
}

export const UndoButton: React.FC<UndoButtonProps> = (props) => {
    const { form } = props;

    return (
        <Button
            type='button'
            className={cn(props.className)}
            disabled={!form.isDirty || form.isSubmitting}
            onClick={() => form.resetForm()}
        >
            {props.children}
        </Button>
    );
};
