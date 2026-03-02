import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

// campi Visit__c
import NAME_FIELD from "@salesforce/schema/Visit__c.Name";
import ACCOUNT_FIELD from "@salesforce/schema/Visit__c.Account__c";
import OPPORTUNITY_FIELD from "@salesforce/schema/Visit__c.Opportunity__c";
import CONTACT_FIELD from "@salesforce/schema/Visit__c.Contact__c";
import DATE_FIELD from "@salesforce/schema/Visit__c.Date__c";

import VISIT_OBJECTIVE_FIELD from "@salesforce/schema/Visit__c.Visit_Objective__c";
import TYPE_FIELD from "@salesforce/schema/Visit__c.Type__c";
import STATUS_FIELD from "@salesforce/schema/Visit__c.Status__c";
import LOCATION_TYPE_FIELD from "@salesforce/schema/Visit__c.Location_Type__c";

import OUTCOME_FIELD from "@salesforce/schema/Visit__c.Outcome__c";
import OUTCOME_DETAILS_FIELD from "@salesforce/schema/Visit__c.Outcome_Details__c";

import TOPICS_DISC_FIELD from "@salesforce/schema/Visit__c.Topics_Discussed__c";
import COMPETITORS_FIELD from "@salesforce/schema/Visit__c.Competitors_Mentioned__c";

import NEXT_STEP_DUE_DATE_FIELD from "@salesforce/schema/Visit__c.Next_Step_Due_Date__c";
import NEXT_STEPS_FIELD from "@salesforce/schema/Visit__c.Next_Steps__c";

import CURRENCY_FIELD from "@salesforce/schema/Visit__c.CurrencyIsoCode";
import LONG_COMMENT_FIELD from "@salesforce/schema/Visit__c.Long_Comment__c";
import ALSO_RELEVANT_FOR_FIELD from "@salesforce/schema/Visit__c.Also_Relevant_For__c";

// Nota: la logica AI girerà lato server (Flow/Apex) dopo il salvataggio del record.
// Se in futuro vuoi richiamare direttamente l'AI dal componente, puoi importare qui un metodo Apex.

export default class EditVisitRecord extends LightningElement {
    @api recordId;

    // modalità: NORMAL / AI
    mode = "NORMAL";

    // --- getters per lightning-input-field (pattern usato anche per Account) ---
    get accountField() {
        return ACCOUNT_FIELD;
    }
    get opportunityField() {
        return OPPORTUNITY_FIELD;
    }
    get contactField() {
        return CONTACT_FIELD;
    }
    get dateField() {
        return DATE_FIELD;
    }

    get visitObjectiveField() {
        return VISIT_OBJECTIVE_FIELD;
    }
    get typeField() {
        return TYPE_FIELD;
    }
    get statusField() {
        return STATUS_FIELD;
    }
    get locationTypeField() {
        return LOCATION_TYPE_FIELD;
    }

    get outcomeField() {
        return OUTCOME_FIELD;
    }
    get outcomeDetailsField() {
        return OUTCOME_DETAILS_FIELD;
    }

    get topicsDiscussedField() {
        return TOPICS_DISC_FIELD;
    }
    get competitorsMentionedField() {
        return COMPETITORS_FIELD;
    }

    get nextStepDueDateField() {
        return NEXT_STEP_DUE_DATE_FIELD;
    }
    get nextStepsField() {
        return NEXT_STEPS_FIELD;
    }

    get currencyField() {
        return CURRENCY_FIELD;
    }
    get alsoRelevantForField() {
        return ALSO_RELEVANT_FOR_FIELD;
    }
    get longCommentField() {
        return LONG_COMMENT_FIELD;
    }

    // --- mode helpers ---
    get isNormalMode() {
        return this.mode === "NORMAL";
    }

    get normalModeVariant() {
        return this.isNormalMode ? "brand" : "neutral";
    }

    get aiModeVariant() {
        return this.isNormalMode ? "neutral" : "brand";
    }

    setNormalMode() {
        this.mode = "NORMAL";
    }

    setAiMode() {
        this.mode = "AI";
    }

    // --- nome record per l’header ---
    @wire(getRecord, { recordId: "$recordId", fields: [NAME_FIELD] })
    record;

    get name() {
        return this.record?.data?.fields?.Name?.value ?? "";
    }

    // --- gestione salvataggio / chiusura ---
    onSuccess(event) {
        // qui potresti eventualmente mettere un messaggio o tracciare analytics
        // e poi chiudere
        this.dismiss(event);
    }

    dismiss() {
        // comportamento uguale al componente Account
        // eslint-disable-next-line no-restricted-globals
        history.back();
    }
}
