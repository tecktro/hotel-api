const DEFAULT_JWT_SECRET = 'development-only-jwt-secret';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;
}
