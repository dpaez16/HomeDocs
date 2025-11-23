import { cn } from '@/lib/utils';
import React from 'react';

interface PageContainerProps {
    className?: string;
    children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = (props) => {
    return (
        <div className={cn('p-4 w-full h-full', props.className)}>
            {props.children}
        </div>
    );
};
