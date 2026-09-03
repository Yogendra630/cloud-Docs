import { FileType } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 30) return formatDate(dateString);
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHrs > 0) return `${diffHrs}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  } catch {
    return 'Just now';
  }
}

export function getFileTypeBadgeStyle(type: FileType): { bg: string; text: string; border: string; label: string } {
  switch (type) {
    case 'PDF':
      return { 
        bg: 'bg-[#FAF0ED] dark:bg-[#341F1B]', 
        text: 'text-[#B84A39] dark:text-[#E88C7D]', 
        border: 'border-[#F2D2C9] dark:border-[#522F29]', 
        label: 'PDF' 
      };
    case 'DOC':
    case 'DOCX':
      return { 
        bg: 'bg-[#EEF3F7] dark:bg-[#1E2C38]', 
        text: 'text-[#3E6585] dark:text-[#8CB4D6]', 
        border: 'border-[#D1DFEC] dark:border-[#2D4559]', 
        label: type 
      };
    case 'XLS':
    case 'XLSX':
      return { 
        bg: 'bg-[#EEF4EC] dark:bg-[#202E1E]', 
        text: 'text-[#47703D] dark:text-[#8DBB81]', 
        border: 'border-[#D0E3CC] dark:border-[#2F472B]', 
        label: type 
      };
    case 'PPT':
    case 'PPTX':
      return { 
        bg: 'bg-[#FAF2E8] dark:bg-[#362719]', 
        text: 'text-[#B06325] dark:text-[#E5A069]', 
        border: 'border-[#F2DCC4] dark:border-[#543B23]', 
        label: type 
      };
    case 'TXT':
      return { 
        bg: 'bg-[#F2EFE9] dark:bg-[#2A2E26]', 
        text: 'text-[#616557] dark:text-[#B6BAAC]', 
        border: 'border-[#DDD8CB] dark:border-[#3E4539]', 
        label: 'TXT' 
      };
    case 'CODE':
      return { 
        bg: 'bg-[#F3EEF7] dark:bg-[#2B2034]', 
        text: 'text-[#6F4E85] dark:text-[#C5A3DE]', 
        border: 'border-[#DFD3E9] dark:border-[#473456]', 
        label: 'CODE' 
      };
    case 'JPG':
    case 'JPEG':
    case 'PNG':
      return { 
        bg: 'bg-[#F8EFF2] dark:bg-[#331E27]', 
        text: 'text-[#9A4666] dark:text-[#DD88A7]', 
        border: 'border-[#ECCFD9] dark:border-[#4F2C3C]', 
        label: 'IMG' 
      };
    case 'ZIP':
      return { 
        bg: 'bg-[#F7F3E6] dark:bg-[#332D1B]', 
        text: 'text-[#8A6F27] dark:text-[#DFC478]', 
        border: 'border-[#EAE1C5] dark:border-[#524628]', 
        label: 'ZIP' 
      };
    default:
      return { 
        bg: 'bg-[#F1EFEA] dark:bg-[#262A23]', 
        text: 'text-[#5E6255] dark:text-[#ACB1A2]', 
        border: 'border-[#DDD9CD] dark:border-[#3B4136]', 
        label: 'FILE' 
      };
  }
}
