using { API_BILLING_DOCUMENT_SRV as db} from './external/API_BILLING_DOCUMENT_SRV';

service MyService {

    entity A_BillingDocumentItem as projection on db.A_BillingDocumentItem;

}