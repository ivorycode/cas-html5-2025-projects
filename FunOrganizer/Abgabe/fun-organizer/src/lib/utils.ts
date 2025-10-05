import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export function formatDateString(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}
