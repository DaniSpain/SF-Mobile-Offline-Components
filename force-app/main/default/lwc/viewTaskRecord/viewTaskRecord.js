import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

import SUBJECT_FIELD from "@salesforce/schema/Task.Subject";
import STATUS_FIELD from "@salesforce/schema/Task.Status";
import PRIORITY_FIELD from "@salesforce/schema/Task.Priority";
import ACTIVITY_DATE_FIELD from "@salesforce/schema/Task.ActivityDate";
import DESCRIPTION_FIELD from "@salesforce/schema/Task.Description";

export default class ViewTaskRecord extends LightningElement {
    @api recordId;
    @api objectApiName;

    get fields() {
        // Puoi aggiungere/rimuovere campi qui a piacere
        return [
            SUBJECT_FIELD,
            STATUS_FIELD,
            PRIORITY_FIELD,
            ACTIVITY_DATE_FIELD,
            DESCRIPTION_FIELD
        ];
    }

    @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
    record;

    // Usato dal <c-record-header> come "nome" del record
    get name() {
        return this.record?.data?.fields?.Subject?.value ?? "";
    }
}
