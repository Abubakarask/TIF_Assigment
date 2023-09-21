class Env {
  static names = [
    "PORT",
    "REDIS_URI",
    "DATABASE_HOST",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
    "DATABASE_REPLICASET",
    "JWT_SECRET",
  ];
  static variable: Record<string, string | null>;

  static Loader() {
    const values: Record<string, string | null> = {};

    for (const key of Env.names) {
      const value = process.env[key];

      if (value) {
        values[key] = value;
      } else {
        if (process.env.NODE_ENV === "development") {
          values[key] = null;
        } else {
          console.error(`Env variable key ${key} is Not Defined`);
          process.exit(1);
        }
      }
    }
    Env.variable = values;
  }
}

export default Env;
