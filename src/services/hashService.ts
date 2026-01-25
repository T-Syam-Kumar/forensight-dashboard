import { HashResult } from '@/types/forensics';

export async function generateSHA256Hash(file: File): Promise<HashResult> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    algorithm: 'SHA-256',
    hash: hashHex,
    fileName: file.name,
    generatedAt: new Date(),
  };
}

export async function generateMD5Hash(file: File): Promise<string> {
  // Note: Web Crypto API doesn't support MD5, so we'd need a library
  // For hackathon purposes, we'll focus on SHA-256
  return 'MD5 not available in Web Crypto API';
}
