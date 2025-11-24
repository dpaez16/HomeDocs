import type { ColumnDef, Row, RowData } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

export const clickableTableItemStyle = 'inline-block text-primary whitespace-break-spaces font-medium text-left px-2 p-1.5 hover:bg-accent hover:cursor-pointer rounded-sm';

interface ColumnProps<T extends RowData> {
    id: string;
    accessorKey: keyof T;
    columnHeader: string;
    filterFn?: (row: Row<T>, id: string, value: any) => boolean;
}

interface TextColumnProps<T extends RowData> extends ColumnProps<T> {
    textFormatterFunc?: (text: string) => string;
    onClick?: (entry: T) => void;
}

export function generateGenericTextColumn<T extends RowData>(data: TextColumnProps<T>): ColumnDef<T> {
    const formatterFunc = data.textFormatterFunc ? data.textFormatterFunc : (text: string) => text;

    const column: ColumnDef<T> = {
        id: data.id,
        accessorKey: data.accessorKey,
        enableSorting: true,
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title={data.columnHeader} />
            );
        },
        filterFn: (row, id, value) => {
            if (data.filterFn) {
                return data.filterFn(row, id, value);
            }

            return value.includes(row.getValue(id));
        },
        cell: ({ cell }) => {
            if (data.onClick !== undefined) {
                return (
                    <div>
                        <p
                            onClick={() => data.onClick!(cell.row.original as T)}
                            className={clickableTableItemStyle}
                        >
                            {formatterFunc(cell.getValue<string>())}
                        </p>
                    </div>
                );
            }

            return <p className='text-primary'>{formatterFunc(cell.getValue<string>())}</p>;
        }
    };

    return column;
}

interface NumericColumnProps<T extends RowData> extends ColumnProps<T> {
    numberFormatterFunc?: (num: number | null) => string;
    onClick?: (entry: T) => void;
}

export function generateGenericNumericColumn<T extends RowData>(data: NumericColumnProps<T>): ColumnDef<T> {
    const formatterFunc = data.numberFormatterFunc ? data.numberFormatterFunc : (num: number) => num.toString();

    const column: ColumnDef<T> = {
        id: data.id,
        accessorKey: data.accessorKey,
        enableSorting: true,
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title={data.columnHeader} />
            );
        },
        filterFn: (row, id, value) => {
            if (data.filterFn) {
                return data.filterFn(row, id, value);
            }

            return value.includes(row.getValue(id));
        },
        cell: ({ cell }) => {
            if (data.onClick !== undefined) {
                return (
                    <div>
                        <p
                            onClick={() => data.onClick!(cell.row.original as T)}
                            className={clickableTableItemStyle}
                        >
                            {formatterFunc(cell.getValue<number>())}
                        </p>
                    </div>
                );
            }

            return <p className='text-primary'>{formatterFunc(cell.getValue<number>())}</p>;
        }
    };

    return column;
}

interface DateColumnProps<T extends RowData> extends ColumnProps<T> {
    dateFormatterFunc: (date: Date | null) => string;
}

export function generateGenericDateColumn<T extends RowData>(data: DateColumnProps<T>): ColumnDef<T> {
    const column: ColumnDef<T> = {
        id: data.id,
        accessorKey: data.accessorKey,
        enableSorting: true,
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title={data.columnHeader} />
            );
        },
        cell: ({ cell }) => {
            return <p className='text-primary'>{data.dateFormatterFunc(cell.getValue<Date>())}</p>;
        },
    };

    return column;
}
