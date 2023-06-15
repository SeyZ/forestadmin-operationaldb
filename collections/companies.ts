import { Agent, CollectionCustomizer } from "@forestadmin/agent";
import { TSchema } from "@forestadmin/datasource-customizer";
const { Client } = require('pg');

export class CompanyCollection {
  agent: Agent;

  constructor(agent) {
    this.agent = agent;

    agent.customizeCollection('sexyCompanies', collection => {
      collection.addManyToOneRelation('company', 'companies', {
        foreignKey: 'project_id',
      });
    });
    
    agent.customizeCollection('enrichments', collection => {
      collection.addManyToOneRelation('company', 'companies', {
        foreignKey: 'project_id',
      });
    });
  }

  customize() {
    this.agent.customizeCollection('companies', collection => {
      this.configureEnrichment(collection);
      this.configureIsSexyField(collection);
      this.configureHealthScore(collection);
      this.addMarkAsLiveAction(collection);
    });
  }

  private configureEnrichment(collection: CollectionCustomizer<TSchema, 'companies'>) {
    collection.addOneToOneRelation('enrichment', 'enrichments', {
      originKey: 'project_id',
      originKeyTarget: 'id'
    });
  
    collection.importField('description', { path: 'enrichment:description', readonly: true });
    collection.importField('website_url', { path: 'enrichment:website_url', readonly: true });
    collection.importField('facebook_url', { path: 'enrichment:facebook_url', readonly: true });
    collection.importField('twitter_url', { path: 'enrichment:twitter_url', readonly: true });
    collection.importField('linkedin_url', { path: 'enrichment:linkedin_url', readonly: true });
    collection.importField('phone', { path: 'enrichment:phone', readonly: true });
    collection.importField('total_funding', { path: 'enrichment:total_funding', readonly: true });
    collection.importField('founded_year', { path: 'enrichment:founded_year', readonly: true });
    collection.importField('annual_revenue', { path: 'enrichment:annual_revenue', readonly: true });
    collection.importField('logo_url', { path: 'enrichment:logo_url', readonly: true });
    collection.importField('employees_count', { path: 'enrichment:employees_count', readonly: true });
    collection.importField('country', { path: 'enrichment:country', readonly: true });
  }

  private addMarkAsLiveAction(collection: CollectionCustomizer<TSchema, 'companies'>) {
    collection.addAction('Mark as live', {
      scope: 'Single',
      execute: async context => {
        context.dataSource.getCollection('companies').update({
          conditionTree: {
            field: 'id',
            operator: 'Equal',
            value: await context.getRecordId()
          }
        }, { status: 'live' });
      },
    });
  }

  private configureHealthScore(collection: CollectionCustomizer<TSchema, 'companies'>) {
    const client = new Client(process.env.DATABASE_URL);
    client.connect();

    collection.addField('healthScore', {
      columnType: 'Number',
      dependencies: ['id'],
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

        const res = await client.query(query, [companyIds]);
        return records.map(company => res.rows.find((row) => row.company_id === company.id)?.healthscore ?? 0);
      },
    });

    collection.emulateFieldFiltering('healthScore');
    collection.emulateFieldSorting('healthScore');

    collection.addAction('Give discount', {
      scope: 'Single',
      form: [{
        label: 'Amount in %',
        description: 'The percentage discount you want to give the company',
        type: 'Number',
        isRequired: true,
      }, {
        label: 'Until',
        description: 'The expiration date of the discount',
        type: 'Date',
      }],
      execute: async context => {
        // Perform work here.
      },
    });

    collection.addAction('Send email', {
      scope: 'Single',
      form: [{
        label: 'Subject',
        type: 'String',
        isRequired: true,
      }, {
        label: 'Message',
        type: 'String',
      }],
      execute: async context => {
        // Perform work here.
      },
    });
  }

  private configureIsSexyField(collection) {
    collection.addOneToOneRelation('sexyCompany', 'sexyCompanies', {
      originKey: 'project_id',
    });
  
    // is_sexy is set to true if the relationship exists.
    collection.addField('is_sexy', {
      columnType: 'Boolean',
      dependencies: ['sexyCompany:project_id'],
      getValues: (records) => records.map(r => !!r.sexyCompany),
    });
  
    // Handle the update of the is_sexy field.
    collection.addHook('Before', 'Update', async (context) => {
      const [record] = await context.dataSource.getCollection('companies').list(context.filter, ['id']);
  
      if (context.patch.is_sexy) {             
        context.dataSource.getCollection('sexyCompanies').create([{
          project_id: record.id,
          created_at: new Date().toISOString()
        }]);
      } else {
        context.dataSource.getCollection('sexyCompanies').delete({
          conditionTree: {
            field: 'project_id',
            operator: 'Equal',
            value: record.id,
          },
        });
      }
    });

    // Handle the create of the is_sexy field.
    collection.addHook('After', 'Create', async (context) => {
      if (context.data[0]?.is_sexy) {      
        context.dataSource.getCollection('sexyCompanies').create([{
          project_id: context.records[0].id,
          created_at: new Date().toISOString()
        }]);
      }
    });

    // Handle the delete of the company
    collection.addHook('Before', 'Delete', async (context) => {
      const [record] = await context.dataSource.getCollection('companies').list(context.filter, ['id']);
      
      context.dataSource.getCollection('sexyCompanies').delete({
        conditionTree: {
          field: 'project_id',
          operator: 'Equal',
          value: record.id,
        },
      });
    });
  
    // Enable the write mode
    collection.replaceFieldWriting('is_sexy', () => {});
  
    // Enable the filtering mode
    collection.emulateFieldFiltering('is_sexy');
  }
}
