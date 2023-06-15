import type { Schema } from "./typings";

import { createAgent } from "@forestadmin/agent";
import { createSqlDataSource } from "@forestadmin/datasource-sql";
import "dotenv/config";
import CompaniesCollection from "./collections/companies";

// This object allows to configure your Forest Admin panel
const agent = createAgent<Schema>({
  authSecret: process.env.FOREST_AUTH_SECRET!,
  envSecret: process.env.FOREST_ENV_SECRET!,
  forestServerUrl: process.env.FOREST_SERVER_URL!,
  isProduction: process.env.NODE_ENV === "production",
  typingsPath: "./typings.ts",
  typingsMaxDepth: 5,
  experimental: {
    webhookCustomActions: true,
  },
});

// Connect your datasources
agent.addDataSource(createSqlDataSource(process.env.DATABASE_URL));

// Customize companies
agent.customizeCollection("companies", (c) => CompaniesCollection.customize(c));

// Expose an HTTP endpoint.
agent.mountOnStandaloneServer(Number(process.env.APPLICATION_PORT));

// Start the agent.
agent.start().catch((error) => {
  console.error("\x1b[31merror:\x1b[0m Forest Admin agent failed to start\n");
  console.error("");
  console.error(error.stack);
  process.exit(1);
});
