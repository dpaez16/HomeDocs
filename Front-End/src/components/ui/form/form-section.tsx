import { cn } from "@/lib/utils";

interface FormSectionProps {
    className?: string;
    children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = (props) => {
    return (
        <div className={cn('grid gap-2', props.className)}>
            {props.children}
        </div>
    );
};
