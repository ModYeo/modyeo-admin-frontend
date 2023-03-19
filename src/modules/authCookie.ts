import { Cookies } from "react-cookie";
import { tokenName } from "../constants/tokens";

interface IAuthCookieManager {
  saveAccessAndRefreshTokenAsCookie: (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
  ) => void;
  getAccessAndRefreshTokenFromCookie: () => [string, string];
  getAccessTokenWithBearer: () => string;
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
    // accessTokenExpiresIn: number,
  ) {
    this.cookies.set(tokenName.accessToken, accessToken, {
      path: "/",
      httpOnly: false,
      sameSite: "strict",
      secure: true,
      // expires: new Date(accessTokenExpiresIn),
    });
    this.cookies.set(tokenName.refreshToken, refreshToken, {
      path: "/",
      httpOnly: false,
      sameSite: "strict",
      secure: true,
    });
  }

  getAccessAndRefreshTokenFromCookie(): [string, string] {
    const accessToken = this.cookies.get(tokenName.accessToken) as string;
    const refreshToken = this.cookies.get(tokenName.refreshToken) as string;
    return [accessToken, refreshToken];
  }

  getAccessTokenWithBearer() {
    const accessToken = this.cookies.get(tokenName.accessToken) as string;
    return `Bearer ${accessToken}`;
  }

  deleteAccessAndRefreshToken() {
    this.cookies.remove(tokenName.accessToken);
    this.cookies.remove(tokenName.refreshToken);
  }
}

const authCookieManager = new AuthCookieManager();

export default authCookieManager;
