export interface IAuth {
  accessToken: string;
  accessTokenExpiresIn: number;
  grantType: string;
  refreshToken: string;
}

export interface ICategories {
  id: number;
  imagePath: string | null;
  name: string;
}
