/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    DB_HOST: "faker.cqpmauffywbw.ap-northeast-2.rds.amazonaws.com",
    DB_USERNAME: "admin",
    DB_PASSWORD: "asdlkj11411",
    DB_NAME: "fmawo.com",
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
        ],
      },
    ];
  },
};
