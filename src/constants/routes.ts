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
  },
} as const;

export default routes;
