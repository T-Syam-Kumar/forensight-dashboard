import { FileMetadata } from '@/types/forensics';

export function extractMetadata(file: File): FileMetadata {
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    lastModified: new Date(file.lastModified),
    permissions: {
      readable: true,
      writable: true,
      executable: file.name.endsWith('.exe') || file.name.endsWith('.sh') || file.name.endsWith('.bat'),
    },
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileTypeIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('text/')) return '📄';
  if (type.startsWith('application/pdf')) return '📕';
  if (type.includes('log')) return '📋';
  if (type.includes('json')) return '📊';
  return '📁';
}
