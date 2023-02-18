export interface IAuth {
  accessToken: string;
  accessTokenExpiresIn: number;
  grantType: string;
  refreshToken: string;
}

export interface ICategory {
  id: number;
  imagePath: string | null;
  name: string;
}
