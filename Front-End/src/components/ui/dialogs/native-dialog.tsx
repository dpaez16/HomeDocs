import type React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog';
import { cn } from '@/lib/utils';

interface NativeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    dialogTitle: React.ReactNode;
    className?: string;
    size?: 'xl' | 'fullscreen';
    children: React.ReactNode;
}

export const NativeDialog: React.FC<NativeDialogProps> = (props) => {
    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={() => props.onClose()}
        >
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent
                className={cn(
                    'grid grid-rows-[1rem,auto]',
                    props.size === 'xl' ? 'max-w-6xl h-full sm:h-auto sm:max-h-[95dvh]' : '',
                    props.size === 'fullscreen' ? 'max-w-[99dvw] h-full sm:max-h-[95dvh]' : '',
                    props.className,
                )}
            >
                <DialogHeader>
                    <DialogTitle>
                        {props.dialogTitle}
                    </DialogTitle>
                </DialogHeader>
                <div className='overflow-hidden h-full'>
                    {props.children}
                </div>
            </DialogContent>
        </Dialog>
    );
};
