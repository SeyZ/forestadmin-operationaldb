import { CollectionCustomizer } from "@forestadmin/agent";
import { Client } from "pg";
import { DataTypes } from "sequelize";
import addOperationalColumns from "../plugins/add-columns";
import { Schema } from "../typings";

type Companies = CollectionCustomizer<Schema, "companies">;

export default class CompaniesCollection {
  private static readonly client = new Client(process.env.DATABASE_URL);

  static customize(collection: Companies) {
    this.client.connect();

    // Add operational columns
    this.addOperationalColumns(collection);

    // Add computed fields
    this.addHealthScoreField(collection);

    // Add actions
    this.addGiveDiscountAction(collection);
    this.addMarkAsLiveAction(collection);
    this.addSendEmailAction(collection);
  }

  private static addOperationalColumns(collection: Companies) {
    // We tell the plugin which columns to add to the collection and where to store them
    // It will create a table in the database, add the columns.

    // Simply adding or removing operational columns in this list should do all the work for the
    // customer.
    collection.use(addOperationalColumns, {
      // Operational database, you can use a sqlite database if you want
      storeAt: process.env.DATABASE_OPERATIONAL_URL,

      // Columns to add to the collection in the admin panel
      columns: {
        // Operational columns
        is_sexy: DataTypes.BOOLEAN,

        // Enrichment columns
        description: DataTypes.STRING,
        website_url: DataTypes.STRING,
        facebook_url: DataTypes.STRING,
        twitter_url: DataTypes.STRING,
        linkedin_url: DataTypes.STRING,
        phone: DataTypes.STRING,
        total_funding: DataTypes.STRING,
        founded_year: DataTypes.STRING,
        annual_revenue: DataTypes.STRING,
        logo_url: DataTypes.STRING,
        employees_count: DataTypes.STRING,
        country: DataTypes.STRING,
      },
    });
  }

  private static addHealthScoreField(collection: Companies) {
    collection.addField("healthScore", {
      columnType: "Number",
      dependencies: ["id"],
      getValues: async (records, context) => {
        const companyIds = records.map((company) => company.id);

        const query = `
          SELECT company_id, CASE
            WHEN total > 10000 then 100
            WHEN total > 5000 THEN 50
            WHEN total > 1 THEN 10
          END as healthscore
          FROM (
            SELECT companies.id as company_id,
              SUM(transactions.amount) AS total
            FROM companies
            JOIN transactions ON transactions.beneficiary_company_id = companies.id
            WHERE companies.id = ANY ($1) 
            GROUP BY companies.id
          ) f;
        `;

        const res = await this.client.query(query, [companyIds]);
        return records.map(
          (company) =>
            res.rows.find((row) => row.company_id === company.id)
              ?.healthscore ?? 0
        );
      },
    });

    collection.emulateFieldFiltering("healthScore");
    collection.emulateFieldSorting("healthScore");
  }

  private static addMarkAsLiveAction(collection: Companies) {
    collection.addAction("Mark as live", {
      scope: "Single",
      execute: async (context) => {
        context.dataSource
          .getCollection("companies")
          .update(context.filter, { status: "live" });
      },
    });
  }

  private static addGiveDiscountAction(collection: Companies) {
    collection.addAction("Give discount", {
      scope: "Single",
      form: [
        {
          label: "Amount in %",
          description: "The percentage discount you want to give the company",
          type: "Number",
          isRequired: true,
        },
        {
          label: "Until",
          description: "The expiration date of the discount",
          type: "Date",
        },
      ],
      execute: async (context) => {
        // Perform work here.
      },
    });
  }

  private static addSendEmailAction(collection: Companies) {
    collection.addAction("Send email", {
      scope: "Single",
      form: [
        {
          label: "Subject",
          type: "String",
          isRequired: true,
        },
        {
          label: "Message",
          type: "String",
        },
      ],
      execute: async (context) => {
        // Perform work here.
      },
    });
  }
}
