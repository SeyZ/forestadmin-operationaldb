import type { Schema } from './typings';

import 'dotenv/config';
import { createAgent } from '@forestadmin/agent';
import { createSqlDataSource } from '@forestadmin/datasource-sql';

const dialectOptions: { [name: string]: any } = {};

if (process.env.DATABASE_SSL && JSON.parse(process.env.DATABASE_SSL.toLowerCase())) {
  // Set to false to bypass SSL certificate verification (useful for self-signed certificates).
  const rejectUnauthorized =
    process.env.DATABASE_REJECT_UNAUTHORIZED &&
    JSON.parse(process.env.DATABASE_REJECT_UNAUTHORIZED.toLowerCase());
  dialectOptions.ssl = rejectUnauthorized ? true : { require: true, rejectUnauthorized };
}

// This object allows to configure your Forest Admin panel
const agent = createAgent<Schema>({
  // Security tokens
  authSecret: process.env.FOREST_AUTH_SECRET!,
  envSecret: process.env.FOREST_ENV_SECRET!,

  // Make sure to set NODE_ENV to 'production' when you deploy your project
  isProduction: process.env.NODE_ENV === 'production',

  // Autocompletion of collection names and fields
  typingsPath: './typings.ts',
  typingsMaxDepth: 5,
});

// Connect your datasources
// All options are documented at https://docs.forestadmin.com/developer-guide-agents-nodejs/data-sources/connection
agent.addDataSource(
  createSqlDataSource({
    uri: process.env.DATABASE_URL,
    schema: process.env.DATABASE_SCHEMA,
    dialectOptions,
  }),
);

// Operational DB
agent.addDataSource(
  createSqlDataSource('postgresql://postgres:Mjoq4g6QopJvnTCp@db.juazlhuakjwkvrlldebd.supabase.co:5432/postgres')
);

import { CompanyCollection } from './collections/companies';
new CompanyCollection(agent).customize();

agent.customizeCollection('SexyCompanies', collection => {
  collection.addManyToOneRelation('company', 'companies', {
    foreignKey: 'project_id',
  });
});

// Expose an HTTP endpoint.
agent.mountOnStandaloneServer(Number(process.env.APPLICATION_PORT));

// Start the agent.
agent.start().catch(error => {
  console.error('\x1b[31merror:\x1b[0m Forest Admin agent failed to start\n');
  console.error('');
  console.error(error.stack);
  process.exit(1);
});
