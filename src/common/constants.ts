/**
 * HTTP error messages and codes
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_JWT: 'Invalid or expired JWT token',
  MISSING_JWT: 'JWT token is missing',
} as const;

/**
 * HTTP status codes (for consistency)
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;
