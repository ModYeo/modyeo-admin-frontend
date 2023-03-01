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

export interface IAdvertisement {
  advertisementId: number;
  advertisementName: string;
  imagePath: string;
  type: null;
  urlLink: string;
  useYn: null;
}

export interface IDetailedAdvertisement extends IAdvertisement {
  createdBy: number;
  createdDate: Array<number>;
  lastModifiedDate: Array<number>;
  type: "ARTICLE";
  updatedBy: number;
  urlLink: string;
  useYn: "Y";
}

export interface INotice {
  content: string;
  id: number;
  imagePath: string;
  title: string;
}

export interface IDetailedNotice extends INotice {
  createdBy: number;
  createdDate: Array<number>;
  updatedBy: number;
  updatedTime: Array<number>;
  useYn: "Y" | "N";
}

export interface ICollection {
  collectionInfoId: number;
  collectionInfoName: string;
  description: string;
  createdBy?: number;
  createdTime?: string;
  updatedBy?: number;
  updatedTime?: string;
}
