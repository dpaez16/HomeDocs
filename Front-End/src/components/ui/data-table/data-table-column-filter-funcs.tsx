import type { Row, RowData } from '@tanstack/react-table';

export function facetedFilterFunc<T extends RowData>(
    row: Row<T>,
    id: string,
    value: string[] | number[],
) {
    return value.includes(row.getValue(id));
}

export function textFilterFunc<T extends RowData>(
    row: Row<T>,
    id: string,
    value: string | number,
) {
    const cellValue = row.getValue<string>(id);
    return cellValue.toLowerCase().includes(value.toString().toLowerCase());
}
