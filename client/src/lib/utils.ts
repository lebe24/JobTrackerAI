import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Current date for comparison
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

export function getCompanyInitials(name: string): string {
  if (!name) return '';
  
  // Split by spaces and get first letter of each word
  const words = name.split(' ');
  
  if (words.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }
  
  return words
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Applied':
      return 'blue';
    case 'In Review':
      return 'yellow';
    case 'Interview':
      return 'green';
    case 'Final Interview':
      return 'green';
    case 'Offer':
      return 'emerald';
    case 'Rejected':
      return 'red';
    case 'Accepted':
      return 'emerald';
    default:
      return 'slate';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}
