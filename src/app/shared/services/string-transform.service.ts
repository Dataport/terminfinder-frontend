import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class StringTransformService {
  constructor() {}

  /**
   *
   * Decodes a base64 encoded string.
   *
   * @param input base64 encoded string
   * @returns decoded string
   */
  public decode(input: string): string {
    return Buffer.from(input, 'base64').toString('utf-8');
  }

  /**
   *
   * Encodes a string to base64.
   *
   * @param input string to encode
   * @returns base64 encoded string
   */
  public encode(input: string): string {
    return Buffer.from(input, 'utf-8').toString('base64');
  }

  /**
   *
   * Sanitizes a potentially unsafe or dirty string.
   *
   * @param input potentially unsafe or dirty string
   * @returns sanitized string
   */
  public sanitize(input: string): string {
    return DOMPurify.sanitize(input);
  }

  /**
   *
   * Decodes a base64 encoded string and sanitizes the result.
   *
   * @param input base64 encoded string
   * @returns sanitized string
   */
  public decodeAndSanitize(input: string): string {
    const decoded = this.decode(input);
    return this.sanitize(decoded);
  }
}
