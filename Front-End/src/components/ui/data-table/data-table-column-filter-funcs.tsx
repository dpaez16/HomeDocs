import type { Row, RowData } from '@tanstack/react-table';

export function facetedFilterFunc<T extends RowData>(
    row: Row<T>,
    id: string,
    value: string[] | number[],
) {
    const cellValue = row.getValue<string>(id);
    return value.includes(cellValue.toString() as never);
}

export function textFilterFunc<T extends RowData>(
    row: Row<T>,
    id: string,
    value: string | number,
) {
    const cellValue = row.getValue<string>(id);
    return cellValue.toLowerCase().includes(value.toString().toLowerCase());
}
