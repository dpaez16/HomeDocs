import React from 'react';
import { Button } from '../button';
import type { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from './data-table-view-options';
import { objectCompare } from '@/utils/objectCompare';

export interface DataTableSubComponentProps<TData> {
    table: Table<TData>
}

export interface DataTableToolbarProps<TData> extends DataTableSubComponentProps<TData> {
    children?: React.ReactNode;
}

interface DataTableToolbarComponentProps<TData> extends DataTableToolbarProps<TData> {
    children: React.ReactNode;
    onReset?: () => void;
}

export const DataTableToolbar = <TData,>({
    children,
    table,
    onReset,
}: DataTableToolbarComponentProps<TData>) => {
    return (
        <div className="flex flex-col md:flex-row items-center md:justify-between my-4">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {children}
                <DataTableToolbarResetButton table={table} onReset={onReset} />
            </div>
            <DataTableViewOptions
                table={table}
            />
        </div>
    );
};

interface DataTableResetButtonProps<TData> {
    table: Table<TData>;
    onReset?: () => void;
}

export const DataTableToolbarResetButton = <TData,>({ table, onReset }: DataTableResetButtonProps<TData>) => {
    const isFiltered = (
        table.getState().columnFilters.length > 0 &&
        !objectCompare(table.initialState.columnFilters, table.getState().columnFilters)
    );

    if (!isFiltered) {
        return null;
    }

    return (
        <Button
            variant='outline'
            onClick={() => {
                table.resetColumnFilters();
                if (onReset) {
                    onReset();
                }
            }}
            className="h-8 px-2 lg:px-3 items-center"
        >
            Reset
        </Button>
    );
};
