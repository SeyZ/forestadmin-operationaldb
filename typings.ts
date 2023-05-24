/* eslint-disable */
export type Schema = {
  'companies': {
    plain: {
      'id': number;
      'name': string;
      'industry': string;
      'headquarter': string;
      'status': string;
      'description': string;
      'created_at': string;
      'updated_at': string;
      'certificate_of_incorporation_id': string;
      'proof_of_address_id': string;
      'bank_statement_id': string;
      'passport_id': string;
      'note': string;
      'company_iban': string;
      'company_bic': string;
      'account': string;
      'bank_name': string;
      'credit_card': any;
      'fa_assignee': string;
      'isSexy': boolean;
    };
    nested: {
      'sexyCompany': Schema['SexyCompanies']['plain'] & Schema['SexyCompanies']['nested'];
    };
    flat: {
      'sexyCompany:id': number;
      'sexyCompany:created_at': string;
      'sexyCompany:project_id': number;
    };
  };
  'contacts': {
    plain: {
      'id': number;
      'first_name': string;
      'last_name': string;
      'email': string;
      'phone': string;
      'position': string;
      'company_id': number;
    };
    nested: {
      'company': Schema['companies']['plain'] & Schema['companies']['nested'];
    };
    flat: {
      'company:id': number;
      'company:name': string;
      'company:industry': string;
      'company:headquarter': string;
      'company:status': string;
      'company:description': string;
      'company:created_at': string;
      'company:updated_at': string;
      'company:certificate_of_incorporation_id': string;
      'company:proof_of_address_id': string;
      'company:bank_statement_id': string;
      'company:passport_id': string;
      'company:note': string;
      'company:company_iban': string;
      'company:company_bic': string;
      'company:account': string;
      'company:bank_name': string;
      'company:credit_card': any;
      'company:fa_assignee': string;
      'company:isSexy': boolean;
      'company:sexyCompany:id': number;
      'company:sexyCompany:created_at': string;
      'company:sexyCompany:project_id': number;
    };
  };
  'documents': {
    plain: {
      'id': number;
      'file_id': string;
      'is_verified': boolean;
      'url': string;
      'type': string;
      'company_id': number;
    };
    nested: {
      'company': Schema['companies']['plain'] & Schema['companies']['nested'];
    };
    flat: {
      'company:id': number;
      'company:name': string;
      'company:industry': string;
      'company:headquarter': string;
      'company:status': string;
      'company:description': string;
      'company:created_at': string;
      'company:updated_at': string;
      'company:certificate_of_incorporation_id': string;
      'company:proof_of_address_id': string;
      'company:bank_statement_id': string;
      'company:passport_id': string;
      'company:note': string;
      'company:company_iban': string;
      'company:company_bic': string;
      'company:account': string;
      'company:bank_name': string;
      'company:credit_card': any;
      'company:fa_assignee': string;
      'company:isSexy': boolean;
      'company:sexyCompany:id': number;
      'company:sexyCompany:created_at': string;
      'company:sexyCompany:project_id': number;
    };
  };
  'SexyCompanies': {
    plain: {
      'id': number;
      'created_at': string;
      'project_id': number;
    };
    nested: {
      'company': Schema['companies']['plain'] & Schema['companies']['nested'];
    };
    flat: {
      'company:id': number;
      'company:name': string;
      'company:industry': string;
      'company:headquarter': string;
      'company:status': string;
      'company:description': string;
      'company:created_at': string;
      'company:updated_at': string;
      'company:certificate_of_incorporation_id': string;
      'company:proof_of_address_id': string;
      'company:bank_statement_id': string;
      'company:passport_id': string;
      'company:note': string;
      'company:company_iban': string;
      'company:company_bic': string;
      'company:account': string;
      'company:bank_name': string;
      'company:credit_card': any;
      'company:fa_assignee': string;
      'company:isSexy': boolean;
    };
  };
  'transactions': {
    plain: {
      'id': number;
      'beneficiary_iban': string;
      'emitter_iban': string;
      'vat_amount': number;
      'amount': number;
      'fee_amount': number;
      'note': string;
      'emitter_bic': string;
      'beneficiary_bic': string;
      'reference': string;
      'created_at': string;
      'updated_at': string;
      'beneficiary_company_id': number;
      'emitter_company_id': number;
      'status': string;
      'fa_assignee': string;
    };
    nested: {
      'beneficiary_company': Schema['companies']['plain'] & Schema['companies']['nested'];
      'emitter_company': Schema['companies']['plain'] & Schema['companies']['nested'];
    };
    flat: {
      'beneficiary_company:id': number;
      'beneficiary_company:name': string;
      'beneficiary_company:industry': string;
      'beneficiary_company:headquarter': string;
      'beneficiary_company:status': string;
      'beneficiary_company:description': string;
      'beneficiary_company:created_at': string;
      'beneficiary_company:updated_at': string;
      'beneficiary_company:certificate_of_incorporation_id': string;
      'beneficiary_company:proof_of_address_id': string;
      'beneficiary_company:bank_statement_id': string;
      'beneficiary_company:passport_id': string;
      'beneficiary_company:note': string;
      'beneficiary_company:company_iban': string;
      'beneficiary_company:company_bic': string;
      'beneficiary_company:account': string;
      'beneficiary_company:bank_name': string;
      'beneficiary_company:credit_card': any;
      'beneficiary_company:fa_assignee': string;
      'beneficiary_company:isSexy': boolean;
      'beneficiary_company:sexyCompany:id': number;
      'beneficiary_company:sexyCompany:created_at': string;
      'beneficiary_company:sexyCompany:project_id': number;
      'emitter_company:id': number;
      'emitter_company:name': string;
      'emitter_company:industry': string;
      'emitter_company:headquarter': string;
      'emitter_company:status': string;
      'emitter_company:description': string;
      'emitter_company:created_at': string;
      'emitter_company:updated_at': string;
      'emitter_company:certificate_of_incorporation_id': string;
      'emitter_company:proof_of_address_id': string;
      'emitter_company:bank_statement_id': string;
      'emitter_company:passport_id': string;
      'emitter_company:note': string;
      'emitter_company:company_iban': string;
      'emitter_company:company_bic': string;
      'emitter_company:account': string;
      'emitter_company:bank_name': string;
      'emitter_company:credit_card': any;
      'emitter_company:fa_assignee': string;
      'emitter_company:isSexy': boolean;
      'emitter_company:sexyCompany:id': number;
      'emitter_company:sexyCompany:created_at': string;
      'emitter_company:sexyCompany:project_id': number;
    };
  };
};
