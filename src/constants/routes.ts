const routes = {
  client: {
    signin: "/",
    admin: "/admin",
  },
  server: {
    signin: "/api/auth/login",
    signout: "/api/auth/logout",
    category: "/api/category",
    advertisement: "/api/advertisement",
    column: "/api/column-code",
    report: "/api/report",
    notice: "/api/notice",
    collection: "/api/collection-info",
    inquiry: {
      index: "/api/inquiry",
      list: "/api/inquiry/list",
    },
  },
} as const;

export default routes;
