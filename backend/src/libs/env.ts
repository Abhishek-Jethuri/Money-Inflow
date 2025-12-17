import "dotenv/config";
import envalid from "envalid";

const env = envalid.cleanEnv(process.env, {
  PORT: envalid.port({ default: 3000 }),
  MONGO_URL: envalid.str(),
  CORS_ORIGIN: envalid.str(),
  JWT_SECRET: envalid.str(),
  REFRESH_SECRET: envalid.str(),
  NODE_ENV: envalid.str({
    choices: ["development", "production"],
    default: "development",
  }),
});

export default env;
