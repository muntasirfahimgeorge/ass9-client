
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const DB_URI = process.env.DB_URI;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

if (!DB_URI || !BETTER_AUTH_SECRET || !BETTER_AUTH_URL) {
  throw new Error("Missing BetterAuth environment configuration");
}

const client = new MongoClient(DB_URI);
const db = client.db("fixmate");

export const auth = betterAuth({
  appName: "FixMate",
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: [BETTER_AUTH_URL],

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: ["customer", "technician", "admin"],
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      area: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role:
              user.role === "technician"
                ? "technician"
                : "customer",
          },
        }),
      },

      update: {
        before: async (userData) => {
          const safeData = { ...userData };

          delete safeData.role;

          return {
            data: safeData,
          };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],
});
