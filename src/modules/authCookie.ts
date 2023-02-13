import { Cookies } from "react-cookie";
import { tokenName } from "../constants/tokens";

interface IAuthCookieManager {
  saveAccessAndRefreshTokenAsCookie: (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
  ) => void;
  getAccessAndRefreshTokenFromCookie: () => [string, string];
  deleteAccessAndRefreshToken: () => void;
}

export class AuthCookieManager implements IAuthCookieManager {
  private cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  saveAccessAndRefreshTokenAsCookie(
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
  ) {
    this.cookies.set(tokenName.accessToken, accessToken, {
      path: "/",
      expires: new Date(accessTokenExpiresIn),
    });
    this.cookies.set(tokenName.refreshToken, refreshToken, {
      path: "/",
    });
  }

  getAccessAndRefreshTokenFromCookie(): [string, string] {
    const accessToken = this.cookies.get(tokenName.accessToken) as string;
    const refreshToken = this.cookies.get(tokenName.refreshToken) as string;
    return [accessToken, refreshToken];
  }

  deleteAccessAndRefreshToken() {
    this.cookies.remove(tokenName.accessToken);
    this.cookies.remove(tokenName.refreshToken);
  }
}

const authCookieManager = new AuthCookieManager();

export default authCookieManager;