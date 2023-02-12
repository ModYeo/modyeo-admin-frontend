interface IAuthCookieManager {
  saveAccessTokenAsCookie: (accessToken: string, refreshToken: string) => void;
  getTokensFromCookie: () => Array<string>;
  deleteAccessToken: () => void;
}

export class AuthCookieManager implements IAuthCookieManager {
  saveAccessTokenAsCookie(accessToken: string, refreshToken: string) {
    // TODO: save token in cookie storage.
    console.log(`${accessToken} ${refreshToken}`);
  }

  getTokensFromCookie() {
    // TODO: get acess, refresh token from cookie.
    return ["tmpAccessToken", "tmpRefreshToken"];
  }

  deleteAccessToken() {
    // TODO: delete access token in cookie storage.
  }
}

const authCookieManager = new AuthCookieManager();

export default authCookieManager;
