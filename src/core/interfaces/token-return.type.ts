export type TokenResponse = Promise<{
  refreshToken: string;
  accessToken: string;
}>;
