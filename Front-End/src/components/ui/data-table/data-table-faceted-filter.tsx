import type { Column } from "@tanstack/react-table";
import { FacetedFilter } from "../faceted-filter";

interface DataTableFacetedFilterProps<TData, TValue> {
    column: Column<TData, TValue> | undefined;
    title: string;
    options?: {
        label: string;
        value: string;
    }[];
    icon?: React.ReactNode;
}

export function DataTableFacetedFilter<TData, TValue>(props: DataTableFacetedFilterProps<TData, TValue>) {
    const {
        column,
        title,
        options,
        icon,
    } = props;

    if (!column) {
        return (<p>Column is undefined.</p>);
    }

    const rawFacets = column.getFacetedUniqueValues();
    const facets = new Map<string, number>();
    for (const key of rawFacets.keys()) {
        facets.set(key.toString(), rawFacets.get(key)!);
    }

    const selectedValues = new Set(column.getFilterValue() as string[]);

    const getOptions = () => {
        if (options) {
            return options.map(o => ({
                ...o,
                count: facets.get(o.value.toString()) ?? 0,
            }));
        }

        const values = new Array(facets.keys() ?? []);
        const uniqueValues = (values[0] && Array.isArray(values[0]))
            ? Array.from(new Set(values.flat()))
            : values;

        return uniqueValues.map(v => ({
            label: v as unknown as string,
            value: v as unknown as string,
            count: facets.get(v.toString()) ?? 0,
        }));
    };

    const handleFilterChange = (newSelectedValues: Set<string>) => {
        const filterValues = Array.from(newSelectedValues);
        column.setFilterValue(filterValues.length ? filterValues : undefined);
    };

    return (
        <FacetedFilter
            title={title}
            options={getOptions()}
            setSelectedValues={handleFilterChange}
            selectedValues={selectedValues}
            icon={icon}
        />
    );
}
