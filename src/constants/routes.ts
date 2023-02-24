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
  },
} as const;

export default routes;
