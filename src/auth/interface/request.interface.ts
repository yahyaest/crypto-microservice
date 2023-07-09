export interface CustomRequest extends Request {
  user: {
    sub: number;
    email: string;
    role: 'ADMIN' | 'USER';
  };
}
