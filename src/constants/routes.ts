const routes = {
  client: {
    signin: "/",
    admin: "/admin",
    report: "/admin/report",
    notice: "/admin/notice",
    category: "/admin/category",
    advertisement: "/admin/advertisement",
    columnCode: "/admin/columnCode",
    collection: "/admin/collection",
    inquiry: "/admin/inquiry",
  },
  server: {
    signin: "/api/auth/login",
    signout: "/api/auth/logout",
    category: "/api/category",
    advertisement: "/api/advertisement",
    column: "/api/column-code",
    report: {
      index: "/api/report",
      type: "/api/report/type",
    },
    notice: "/api/notice",
    collection: "/api/collection-info",
    inquiry: {
      index: "/api/inquiry",
      list: "/api/inquiry/list",
    },
    answer: "/api/answer",
    reissueAccessToken: "/api/auth/reissue",
    checkTokensValidation: "/api/auth/token/valid",
  },
} as const;

export default routes;
