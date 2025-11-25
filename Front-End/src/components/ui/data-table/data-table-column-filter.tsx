import type { Column } from '@tanstack/react-table';
import { Input } from '../input';
import { cn } from '@/lib/utils';

interface DataTableColumnFilterProps<TData, TValue> extends React.InputHTMLAttributes<HTMLInputElement> {
    column?: Column<TData, TValue>
}

export function DataTableColumnFilter<TData, TValue> ({ column, ...props }: DataTableColumnFilterProps<TData, TValue>) {
    return (
        <Input
            value={(column?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
                column?.setFilterValue(event.target.value)
            }
            type={'search'}
            {...props}
            className={cn('w-full sm:w-[150px] lg:w-[250px]', props.className)}
        />
    );
}
