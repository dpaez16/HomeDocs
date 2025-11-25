import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface SimpleTooltipProps {
    text?: string;
    children: React.ReactNode;
}

export const SimpleTooltip: React.FC<SimpleTooltipProps> = (props) => {
    const text = props.text;

    if (!text) {
        return props.children;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{props.children}</TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    );
};
