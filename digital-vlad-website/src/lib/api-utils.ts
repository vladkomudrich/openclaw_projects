import { NextResponse } from 'next/server';

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  const body: ApiSuccess<T> = { data };
  if (message) body.message = message;
  return NextResponse.json(body, { status });
}

/**
 * Create error response
 */
export function errorResponse(error: string, status = 400, details?: unknown): NextResponse {
  const body: ApiError = { error };
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

/**
 * Generate slug from string
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }

  return { valid: missing.length === 0, missing };
}
