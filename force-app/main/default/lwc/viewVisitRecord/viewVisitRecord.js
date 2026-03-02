import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

// Standard
import NAME_FIELD from "@salesforce/schema/Visit__c.Name";
import OWNER_FIELD from "@salesforce/schema/Visit__c.OwnerId";

// Lookup principali
import ACCOUNT_FIELD from "@salesforce/schema/Visit__c.Account__c";
import OPPORTUNITY_FIELD from "@salesforce/schema/Visit__c.Opportunity__c";
import CONTACT_FIELD from "@salesforce/schema/Visit__c.Contact__c";

// Campi di business
import DATE_FIELD from "@salesforce/schema/Visit__c.Date__c";
import STATUS_FIELD from "@salesforce/schema/Visit__c.Status__c";
import TYPE_FIELD from "@salesforce/schema/Visit__c.Type__c";
import LOCATION_TYPE_FIELD from "@salesforce/schema/Visit__c.Location_Type__c";
import VISIT_OBJECTIVE_FIELD from "@salesforce/schema/Visit__c.Visit_Objective__c";

import OUTCOME_FIELD from "@salesforce/schema/Visit__c.Outcome__c";
import OUTCOME_DETAILS_FIELD from "@salesforce/schema/Visit__c.Outcome_Details__c";
import NEXT_STEP_DUE_DATE_FIELD from "@salesforce/schema/Visit__c.Next_Step_Due_Date__c";
import NEXT_STEPS_FIELD from "@salesforce/schema/Visit__c.Next_Steps__c";

import TOPICS_DISCUSSED_FIELD from "@salesforce/schema/Visit__c.Topics_Discussed__c";
import COMPETITORS_MENTIONED_FIELD from "@salesforce/schema/Visit__c.Competitors_Mentioned__c";

import LONG_COMMENT_FIELD from "@salesforce/schema/Visit__c.Long_Comment__c";
import ALSO_RELEVANT_FOR_FIELD from "@salesforce/schema/Visit__c.Also_Relevant_For__c";


export default class ViewVisitRecord extends LightningElement {
    @api recordId;
    @api objectApiName; // "Visit__c"

    // Campi mostrati nel lightning-record-form
    get fields() {
        return [
            NAME_FIELD,
            OWNER_FIELD,
            ACCOUNT_FIELD,
            OPPORTUNITY_FIELD,
            CONTACT_FIELD,
            DATE_FIELD,
            STATUS_FIELD,
            TYPE_FIELD,
            LOCATION_TYPE_FIELD,
            VISIT_OBJECTIVE_FIELD,
            OUTCOME_FIELD,
            OUTCOME_DETAILS_FIELD,
            NEXT_STEP_DUE_DATE_FIELD,
            NEXT_STEPS_FIELD,
            TOPICS_DISCUSSED_FIELD,
            COMPETITORS_MENTIONED_FIELD,
            LONG_COMMENT_FIELD,
            ALSO_RELEVANT_FOR_FIELD
        ];
    }

    @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
    record;

    // Etichetta usata nel <c-record-header>
    get name() {
        return this.record?.data?.fields?.Name?.value ?? "";
    }
}
