import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import QUOTE_NAME_FIELD from "@salesforce/schema/Quote.Name";
import QUOTE_STATUS_FIELD from "@salesforce/schema/Quote.Status";
import QUOTE_ACCOUNT_FIELD from "@salesforce/schema/Quote.AccountId";
import QUOTE_OPPORTUNITY_FIELD from "@salesforce/schema/Quote.OpportunityId";
import QUOTE_GRANDTOTAL_FIELD from "@salesforce/schema/Quote.GrandTotal";
import QUOTE_EXPIRATIONDATE_FIELD from "@salesforce/schema/Quote.ExpirationDate";
import QUOTE_OWNER_FIELD from "@salesforce/schema/Quote.OwnerId";

export default class ViewQuoteRecord extends LightningElement {
  @api recordId;
  @api objectApiName;

  get fields() {
    return [
      QUOTE_NAME_FIELD,
      QUOTE_STATUS_FIELD,
      QUOTE_ACCOUNT_FIELD,
      QUOTE_OPPORTUNITY_FIELD,
      QUOTE_GRANDTOTAL_FIELD,
      QUOTE_EXPIRATIONDATE_FIELD,
      QUOTE_OWNER_FIELD,
    ];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  record;

  get name() {
    return this.record?.data?.fields?.Name?.value ?? "";
  }
}
