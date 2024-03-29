const routes = {
  client: {
    signin: "/signin",
    admin: "/admin",
    report: "/report/type",
    reportDetail: "/report",
    notice: "/notice",
    category: "/category",
    advertisement: "/advertisement",
    columnCode: "/columnCode",
    collection: "/collection",
    inquiry: "/inquiry",
    noData: "/no-data",
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
