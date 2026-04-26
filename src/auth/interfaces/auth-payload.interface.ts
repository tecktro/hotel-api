/**
 * JWT Payload interface
 */
export interface IJwtPayload {
  user: string;
  sub: string;
  role: string;
}

/**
 * Login response interface
 */
export interface ILoginResponse {
  access_token: string;
}

/**
 * Auth Service interface
 */
export interface IAuthService {
  validateUser(username: string, password: string): Promise<any | null>;
  login(user: any): Promise<ILoginResponse>;
}
