import { createSequelizeDataSource } from "@forestadmin/datasource-sequelize";
import {
  CollectionCustomizer,
  DataSourceCustomizer,
} from "@forestadmin/datasource-customizer";
import { DataType, DataTypes, Sequelize } from "sequelize";

//////////////////////////////////////////
// I'm using an internal plugin here to handle all the heavy lifting to add columns to collections.
// This makes it reuseable across collections so that adding a column to a collection is a one-liner.
//
// The idea of plugins, is that if we think that a feature is useful to many users, we can
// - publish them on npm as a separate package '@forestadmin/plugin-add-operational-columns'
// - document them on https://docs.forestadmin.com/developer-guide-agents-nodejs/agent-customization/plugins/provided-plugins
//////////////////////////////////////////

type Columns = Record<string, DataType>;

async function createOperationalTable(
  sequelize: Sequelize,
  tableName: string,
  columns: Columns
) {
  // Create operational table
  sequelize.define(
    `operational_${tableName}`,
    { id: { type: DataTypes.INTEGER, primaryKey: true }, ...columns },
    { tableName }
  );

  // Synchronize the Sequelize instance with the database
  await sequelize.sync();
}

function linkDatabases(collection: CollectionCustomizer, columns: Columns) {
  //  link main db collection to operational db collection
  collection.addOneToOneRelation(
    "operational",
    `operational_${collection.name}`,
    { originKey: "id", originKeyTarget: "id" }
  );

  // import all fields from operational db
  for (const columnName of Object.keys(columns))
    collection.importField(columnName, {
      path: `operational:${columnName}`,
      readonly: false,
    });

  // remove link to operational db collection
  collection.removeField("operational");

  // remove operational db collection
  // This actually does not work... we have a branch implementing this feature that
  // has been waiting for months to be finished as it was deprioritized along with all work
  // on the agent.
  // dataSource.removeCollection(`operational_${collection.name}`);
}

export default async function addOperationalColumns(
  dataSource: DataSourceCustomizer,
  collection: CollectionCustomizer,
  options: { storeAt: string; columns: Columns }
) {
  if (!collection) throw new Error("This plugin must be called on collections");

  // Create operational table, and load it into forestadmin
  const sequelize = new Sequelize(options.storeAt);
  await createOperationalTable(sequelize, collection.name, options.columns);
  dataSource.addDataSource(createSequelizeDataSource(sequelize));

  // Link main db collection to operational db collection
  linkDatabases(collection, options.columns);
}
