import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

import SUBJECT_FIELD from "@salesforce/schema/Event.Subject";
import START_FIELD from "@salesforce/schema/Event.StartDateTime";
import END_FIELD from "@salesforce/schema/Event.EndDateTime";
import LOCATION_FIELD from "@salesforce/schema/Event.Location";
import DESCRIPTION_FIELD from "@salesforce/schema/Event.Description";

export default class ViewEventRecord extends LightningElement {
    @api recordId;
    @api objectApiName;

    get fields() {
        // Qui puoi aggiungere / togliere campi come preferisci
        return [
            SUBJECT_FIELD,
            START_FIELD,
            END_FIELD,
            LOCATION_FIELD,
            DESCRIPTION_FIELD
        ];
    }

    @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
    record;

    // Nome visualizzato nel <c-record-header>
    get name() {
        return this.record?.data?.fields?.Subject?.value ?? "";
    }
}
