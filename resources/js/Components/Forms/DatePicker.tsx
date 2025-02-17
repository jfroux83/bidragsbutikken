import React, {useEffect, useRef, useState} from "react";

interface Props {
    name: string;
    label: string;
    value: string;
    error?: string;
    onChange: (name: string, value: string) => void;
    required?: boolean;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    classNames?: string;
    format?: 'Y-m-d' | 'd-m-Y';
    separator?: '-' | '/'
}

const datePicker = ({
    name,
    label,
    value,
    error,
    onChange,
    required = false,
    disabled = false,
    minDate,
    maxDate,
    classNames = '',
    format = 'Y-m-d',
    separator = '-'
}: Props) => {

    const [showCalendar, setShowCalendar] = useState(false)
    const [currentDate, setCurrentDate] = useState(() => {
        if (!value) return new Date();

        try {
            // Split the date string regardless of separator
            const parts = value.split(/[-\/]/);

            if (format === 'Y-m-d') {
                const [year, month, day] = parts.map(Number);
                return new Date(year, month - 1, day);
            } else { // d-m-Y format
                const [day, month, year] = parts.map(Number);
                return new Date(year, month - 1, day);
            }
        } catch {
            return new Date();
        }
    });
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!value) return;

        try {
            const parts = value.split(/[-\/]/);

            if (format === 'Y-m-d') {
                const [year, month, day] = parts.map(Number);
                setCurrentDate(new Date(year, month - 1, day));
            } else {
                const [day, month, year] = parts.map(Number);
                setCurrentDate(new Date(year, month - 1, day));
            }
        } catch {
            // Keep current date if parsing fails
        }
    }, [value, format]);

    const formatDateForInput = (date: Date | string): string => {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();

        return format === 'Y-m-d'
            ? `${year}${separator}${month}${separator}${day}`
            : `${day}${separator}${month}${separator}${year}`;
    };

    const parseDateString = (dateString: string): Date => {
        if (!dateString) return new Date();

        // Handle both separators
        const parts = dateString.split(/[-\/]/);

        if (format === 'Y-m-d') {
            const [year, month, day] = parts.map(Number);
            return new Date(year, month - 1, day);
        } else {
            const [day, month, year] = parts.map(Number);
            return new Date(year, month - 1, day);
        }
    };

    const formatDate = (date: Date): string => {
        return formatDateForInput(date);
    };

    const getDisplayValue = () => {
        if (!value) return '';
        try {
            const date = parseDateString(value);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();

            return format === 'Y-m-d'
                ? `${year}${separator}${month}${separator}${day}`
                : `${day}${separator}${month}${separator}${year}`;
        } catch {
            return '';
        }
    };

    const isValidDate = (date: Date): boolean => {
        if (isNaN(date.getTime())) return false;

        const minValidDate = minDate ? new Date(minDate) : null;
        const maxValidDate = maxDate ? new Date(maxDate) : null;

        if (minValidDate && date < minValidDate) return false;
        if (maxValidDate && date > maxValidDate) return false;

        return true;
    };

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getMonthData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        let firstDay = new Date(year, month, 1).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = getDaysInMonth(year, month);
        const weeks: (number | null)[][] = [];

        let currentWeek: (number | null)[] = Array(firstDay).fill(null);

        for (let day = 1; day <= daysInMonth; day++) {
            currentWeek.push(day);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        if (currentWeek.length > 0) {
            weeks.push([...currentWeek, ...Array(7 - currentWeek.length).fill(null)]);
        }

        return weeks;
    }

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (isValidDate(newDate)) {
            onChange(name, formatDate(newDate));
            setShowCalendar(false);
        }
    }

    const handleMonthChange = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate)
    }

    const handleYearChange = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(newDate.getFullYear() + increment);
        setCurrentDate(newDate);
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className={`relative ${classNames}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={getDisplayValue()}
                    onClick={() => !disabled && setShowCalendar(true)}
                    readOnly
                    disabled={disabled}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#508ABE] cursor-pointer ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${error ? 'border-red-500' : 'border-gray-200'}`}
                />
            </div>

            {showCalendar && (
                <div
                    ref={calendarRef}
                    className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                >
                    <div className="flex justify-between items-center mb-4">
                        <button
                            type="button"
                            onClick={() => handleYearChange(-1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            &lt;&lt;
                        </button>
                        <button
                            type="button"
                            onClick={() => handleMonthChange(-1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            &lt;
                        </button>
                        <span className="font-medium">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleMonthChange(1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            &gt;
                        </button>
                        <button
                            type="button"
                            onClick={() => handleYearChange(1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            &gt;&gt;
                        </button>
                    </div>

                    <table className="w-full">
                        <thead>
                            <tr>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <th
                                        key={day}
                                        className="px-1 py-2 text-center text-gray-600 text-sm"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getMonthData().map((week, weekIndex) => (
                                <tr key={weekIndex}>
                                    {week.map((day, dayIndex) => {
                                        if (day === null) {
                                            return <td key={dayIndex} className="p-1" />
                                        }

                                        const date = new Date(
                                            currentDate.getFullYear(),
                                            currentDate.getMonth(),
                                            day
                                        );
                                        const isSelected = value === formatDate(date)
                                        const isValid = isValidDate(date);

                                        return (
                                            <td
                                                key={dayIndex}
                                                className="p-1 text-center"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => isValid && handleDateSelect(day)}
                                                    className={`w-8 h-8 rounded-full ${isSelected ? 'bg-[#0E4F6C] text-white' : isValid ? 'hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                                    disabled={disabled}
                                                >
                                                    {day}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

export default datePicker;
