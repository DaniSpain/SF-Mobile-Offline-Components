import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import QLI_QUOTE_FIELD from "@salesforce/schema/QuoteLineItem.QuoteId";
import QLI_PRODUCT_FIELD from "@salesforce/schema/QuoteLineItem.Product2Id";
import QLI_QUANTITY_FIELD from "@salesforce/schema/QuoteLineItem.Quantity";
import QLI_UNITPRICE_FIELD from "@salesforce/schema/QuoteLineItem.UnitPrice";
import QLI_DISCOUNT_FIELD from "@salesforce/schema/QuoteLineItem.Discount";
import QLI_LISTPRICE_FIELD from "@salesforce/schema/QuoteLineItem.ListPrice";
import QLI_SUBTOTAL_FIELD from "@salesforce/schema/QuoteLineItem.Subtotal";
import QLI_TOTALPRICE_FIELD from "@salesforce/schema/QuoteLineItem.TotalPrice";

export default class ViewQuoteLineItemRecord extends LightningElement {
  @api recordId;
  @api objectApiName;

  get fields() {
    return [
      QLI_QUOTE_FIELD,
      QLI_PRODUCT_FIELD,
      QLI_QUANTITY_FIELD,
      QLI_UNITPRICE_FIELD,
      QLI_DISCOUNT_FIELD,
      QLI_LISTPRICE_FIELD,
      QLI_SUBTOTAL_FIELD,
      QLI_TOTALPRICE_FIELD,
    ];
  }

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  record;

  get name() {
    return this.record?.data?.fields?.Name?.value ?? "";
  }
}
