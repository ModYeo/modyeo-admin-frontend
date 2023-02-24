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

export interface IDetailedCategory {
  categoryId: number;
  categoryName: string;
  useYn: "Y" | "N";
  createdBy: null;
  createdTime: string;
  updatedBy: null;
  updatedTime: string;
}

export interface IColumCode {
  code: string;
  columnCodeId: number;
  columnCodeName: string;
  description: string;
}

export interface IDetailedColumnCode extends IColumCode {
  createdTime: null;
  email: null;
}
