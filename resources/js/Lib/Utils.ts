/**
 * Combines multiple class names into a single string, filtering out falsy values
 * @param {...(string | undefined | null | boolean)} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function classNames(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}

// Alternative implementation using object syntax
export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]): string {
    return inputs
        .flatMap((item) => {
            if (!item) return [];
            if (typeof item === 'string') return item;
            if (typeof item === 'object') {
                return Object.entries(item)
                    .filter(([_, value]) => Boolean(value))
                    .map(([key]) => key);
            }
            return [];
        })
        .join(' ');
}

export function formatDate(date: string | Date, format: string = 'dd/MM/yyyy'): string {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return '';
    }

    // Simple format tokens
    const tokens: Record<string, string> = {
        dd: d.getDate().toString().padStart(2, '0'),
        MM: (d.getMonth() + 1).toString().padStart(2, '0'),
        yyyy: d.getFullYear().toString(),
        HH: d.getHours().toString().padStart(2, '0'),
        mm: d.getMinutes().toString().padStart(2, '0'),
        ss: d.getSeconds().toString().padStart(2, '0'),
    };

    // Replace tokens in format string
    return format.replace(/dd|MM|yyyy|HH|mm|ss/g, match => tokens[match]);
}
