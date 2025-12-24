export const PORT = process.env.PORT || 3000;

export const CORS_OPTIONS = {
  origin: String(process.env.CORS_ORIGIN),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export const SOCKET_CORS_OPTIONS = {
  origin: [
    String(process.env.CORS_ORIGIN),
    "https://admin.socket.io",
    "http://localhost:3000",
  ],
  credentials: true,
};
