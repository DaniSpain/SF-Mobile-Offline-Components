public with sharing class VisitAIUpdater {

    /**
     * Wrapper per l'invocazione da Flow.
     * Ogni elemento della lista rappresenta una "chiamata" al servizio AI
     * per un singolo record Visit__c.
     */
    public class Request {
        @InvocableVariable(required=true)
        public Id visitId;

        @InvocableVariable(required=true)
        public String jsonPayload;
    }

    /**
     * Metodo invocabile da Flow.
     * 
     * In Flow:
     * - Aggiungi un'azione di tipo "Apex"
     * - Seleziona: VisitAIUpdater.updateVisitsFromJson
     * - Passa visitId e jsonPayload per ciascun record.
     */
    @InvocableMethod(
        label='Update Visit from JSON'
        description='Aggiorna record Visit__c in base a un payload JSON (esito AI).'
    )
    public static void updateVisitsFromJson(List<Request> requests) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        List<Visit__c> visitsToUpdate = new List<Visit__c>();

        for (Request req : requests) {
            if (req == null || req.visitId == null || String.isBlank(req.jsonPayload)) {
                // salto input non valido, ma non blocco tutto il batch
                continue;
            }

            Visit__c v = buildVisitFromJson(req.visitId, req.jsonPayload);
            v.Status__c = 'Completed';
            if (v != null) {
                visitsToUpdate.add(v);
            }
        }

        if (!visitsToUpdate.isEmpty()) {
            update visitsToUpdate;
        }
    }

    /**
     * Costruisce un record Visit__c da aggiornare a partire dal JSON.
     * NON fa DML, viene usato dal metodo invocabile.
     */
    private static Visit__c buildVisitFromJson(Id visitId, String jsonPayload) {
        // Parse JSON in una mappa generica
        Map<String, Object> dataMap;
        try {
            dataMap = (Map<String, Object>) JSON.deserializeUntyped(jsonPayload);
        } catch (Exception e) {
            // Se il JSON è malformato, sollevo un'eccezione gestibile dal Flow
            throw new AuraHandledException('Invalid JSON payload: ' + e.getMessage());
        }

        if (dataMap == null || dataMap.isEmpty()) {
            return null;
        }

        Visit__c v = new Visit__c(Id = visitId);

        for (String fieldApiName : dataMap.keySet()) {
            Object value = dataMap.get(fieldApiName);

            // Multipicklist: Also_Relevant_For__c
            if (fieldApiName == 'Also_Relevant_For__c' && value instanceof List<Object>) {
                List<Object> listVal = (List<Object>) value;
                List<String> listStr = new List<String>();

                for (Object o : listVal) {
                    if (o != null) {
                        listStr.add((String) o);
                    }
                }

                // multipicklist Salesforce: valori separati da ;
                String joined = String.join(listStr, ';');
                v.put(fieldApiName, joined);
                continue;
            }

            // Date: Next_Step_Due_Date__c nel formato "YYYY-MM-DD"
            if (fieldApiName == 'Next_Step_Due_Date__c' && value != null) {
                try {
                    Date d = Date.valueOf((String) value);
                    v.put(fieldApiName, d);
                } catch (Exception e) {
                    throw new AuraHandledException(
                        'Invalid date format for Next_Step_Due_Date__c. Expected YYYY-MM-DD.'
                    );
                }
                continue;
            }

            // Default: assegno il valore così com’è (String, ecc.)
            v.put(fieldApiName, value);
        }

        return v;
    }
}
