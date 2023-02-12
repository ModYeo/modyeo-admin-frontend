const routes = {
  client: {
    admin: "/admin",
  },
  server: {
    signin: "/api/auth/login",
    signout: "/api/auth/logout",
  },
} as const;

export default routes;
