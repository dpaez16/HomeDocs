import { cn } from '@/lib/utils';
import React from 'react';

interface PageDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

export const PageDescription: React.FC<PageDescriptionProps> = (props) => {
    return (
        <p className={cn('text-sm text-muted-foreground', props.className)}>
            {props.children}
        </p>
    );
};
