type Role = 'USER' | 'ADMIN' | 'SUPERADMIN';
type Roles = Role[];

type TStrategy = 'GOOGLE' | 'GITHUB' | 'LOCAL';

type TRefreshTokenPayload = {
  id: string;
  strategy: TStrategy;
  iat?: number;
  jti?: string;
  exp?: number;
};

// TODO: session protecting
// refresh and delete old
// reenter password to update, change pw, admin change or on IP change, if pw wrong, delete session
// on location change for single session, delete session
// if 2 sessions up together, kill both
// logout deletes the session from db
// email user of logins
type SessionPayload = {
  user: string;
  strategy: TStrategy;
  role: Role;
  email: string;
  userAgent: string;
  ip: string;
};
