# Offline App Developer Starter Kit

Questo repository e' un progetto **SFDX / Salesforce DX** pensato come base di lavoro per sviluppare e testare **Lightning Web Components** e **Quick Actions** da usare nella **Salesforce Mobile App con supporto offline**.

L'obiettivo del progetto non e' solo mostrare componenti CRUD standard, ma raccogliere esempi pratici di funzionalita' tipiche di uno scenario mobile offline:

- visualizzazione record offline con `*.view`
- creazione e modifica record con `*.create` e `*.edit`
- related list offline tramite GraphQL
- lookup offline
- upload file
- barcode scanning
- geolocalizzazione
- gestione draft locali
- supporto a oggetti custom

In questo fork sono presenti anche personalizzazioni orientate all'oggetto **`Visit__c`**, usato come esempio di visita sul campo con logica di checkout e aggiornamento server-side tramite Apex/Flow.

## Struttura del progetto

Le cartelle principali sono:

- `force-app/main/default/lwc`: componenti Lightning Web Components
- `force-app/main/default/quickActions`: quick action LWC usate dall'app mobile
- `force-app/main/default/classes`: Apex di supporto
- `force-app/main/default/objects`: metadati di oggetti custom
- `force-app/main/default/layouts`: layout che espongono le quick action
- `force-app/main/default/staticresources`: configurazioni di landing page/offline app
- `docs`: documentazione di approfondimento per alcuni esempi

## Come leggere il progetto

Il pattern principale e' questo:

1. un componente `view...` mostra il record offline
2. il relativo file quick action `<Object>.view.quickAction-meta.xml` lo rende disponibile nell'app
3. eventuali componenti `edit...`, `create...` e related list vengono aggiunti al layout mobile
4. il **Briefcase** decide quali record sono realmente disponibili offline

## Componenti LWC

Di seguito trovi tutti i componenti LWC presenti nel repository, con il loro scopo.

### Componenti di visualizzazione record

| Componente | Scopo |
| --- | --- |
| `viewAccountRecord` | Visualizza un record `Account` offline usando UI Record API e mostra anche i dettagli dei draft locali. |
| `viewContactRecord` | Visualizza un record `Contact` offline. |
| `viewOpportunityRecord` | Visualizza un record `Opportunity` offline. |
| `viewVisitRecord` | Visualizza un record `Visit__c` con i campi principali della visita: account, opportunita', contatto, data, obiettivo, esito, next step e note. |
| `viewStarterKitCustomObjectRecord` | Visualizza record dell'oggetto custom `StarterKitCustomObject__c`. |
| `viewProduct2Record` | Visualizza un prodotto `Product2`; viene usato anche nel flusso di barcode lookup. |
| `viewQuoteRecord` | Visualizza un record `Quote`. |
| `viewQuoteLineItemRecord` | Visualizza un record `QuoteLineItem`. |
| `viewTaskRecord` | Visualizza un record `Task`. |
| `viewEventRecord` | Visualizza un record `Event`. |

### Componenti di creazione record

| Componente | Scopo |
| --- | --- |
| `createAccountRecord` | Crea un nuovo `Account` da mobile/offline. |
| `createContactRecord` | Crea un nuovo `Contact`; include un esempio di **lookup offline** verso `Account` tramite `lightning-record-picker`. |
| `createOpportunityRecord` | Crea un nuovo `Opportunity`. |
| `createVisitRecord` | Crea un nuovo record `Visit__c`. |
| `createStarterKitCustomObjectRecord` | Crea un nuovo record `StarterKitCustomObject__c`. |

### Componenti di modifica record

| Componente | Scopo |
| --- | --- |
| `editAccountRecord` | Modifica un record `Account` offline. |
| `editContactRecord` | Modifica un record `Contact` offline. |
| `editOpportunityRecord` | Modifica un record `Opportunity` offline. |
| `editVisitRecord` | Modifica un record `Visit__c`; nel progetto e' usato come azione di **checkout** della visita e prevede anche una distinzione tra modalita' normale e AI. |
| `editStarterKitCustomObjectRecord` | Modifica un record `StarterKitCustomObject__c`. |

### Related list e navigazione su record collegati

| Componente | Scopo |
| --- | --- |
| `accountRelatedContacts` | Elenca i `Contact` collegati a un `Account` tramite GraphQL e consente la navigazione al record di dettaglio. |
| `accountRelatedOpportunities` | Elenca le `Opportunity` collegate a un `Account`, ordinate per `CloseDate`, con formattazione di importi e date. |
| `accountRelatedTasks` | Elenca i `Task` collegati a un `Account` via GraphQL. |
| `accountRelatedVisits` | Elenca le visite `Visit__c` collegate a un `Account`. |
| `opportunityRelatedQuotes` | Elenca le `Quote` collegate a una `Opportunity`. |
| `recordRelatedFiles` | Mostra i file collegati a un record tramite `ContentDocumentLink`; gestisce preview immagini e apertura/download online. |

### Mobile capabilities

| Componente | Scopo |
| --- | --- |
| `scanBarcode` | Esempio base di uso della capability mobile `BarcodeScanner`. Dimostra solo la scansione. |
| `scanBarcodeLookup` | Global action che legge un barcode EAN-13, cerca un `Product2` per `ProductCode` via GraphQL e apre il record trovato. |
| `locationService` | Esempio di uso della capability mobile `LocationService` per leggere latitudine e longitudine correnti. |
| `fileUpload` | Carica un file creando `ContentDocument`/`ContentVersion` e lo collega al record corrente con `ContentDocumentLink`. |

### Componenti di supporto / utility UI

| Componente | Scopo |
| --- | --- |
| `recordHeader` | Header riutilizzabile per le schermate di view/edit/create, con nome record e icona oggetto. |
| `draftDetailsList` | Mostra i valori draft locali di un record, utile per capire le differenze tra cache locale e server. |
| `errorPanel` | Pannello standard per la visualizzazione degli errori LWC/UI API. |
| `ldsUtils` | Utility JavaScript per normalizzare e formattare errori da LDS/UI API/Apex. |
| `commonStyles` | Foglio di stile condiviso da piu' componenti. |

### Componenti dimostrativi Apex

| Componente | Scopo |
| --- | --- |
| `viewAccountsWithApex` | Esempio di componente che usa Apex (`AccountController.getAccountList`) per mostrare gli ultimi 10 Account creati. Utile come demo tecnica, meno adatto dei componenti LDS/UI API per scrittura offline. |

## Quick Actions

Queste quick action collegano i componenti LWC all'esperienza mobile offline. I nomi `view`, `create` ed `edit` sono particolarmente importanti per il comportamento dell'app offline.

| Quick Action | LWC | Scopo |
| --- | --- | --- |
| `Account.view` | `viewAccountRecord` | Vista offline principale di un Account. |
| `Account.create` | `createAccountRecord` | Creazione di un nuovo Account. |
| `Account.edit` | `editAccountRecord` | Modifica di un Account. |
| `Account.relatedContacts` | `accountRelatedContacts` | Elenco dei contatti collegati all'Account. |
| `Account.relatedOpportunities` | `accountRelatedOpportunities` | Elenco delle opportunita' collegate all'Account. |
| `Account.relatedTasks` | `accountRelatedTasks` | Elenco dei task collegati all'Account. |
| `Account.relatedVisits` | `accountRelatedVisits` | Elenco delle visite collegate all'Account. |
| `Account.relatedFiles` | `recordRelatedFiles` | Elenco file collegati all'Account. |
| `Account.viewAccountsWithApex` | `viewAccountsWithApex` | Demo di query Apex su Account. |
| `Contact.view` | `viewContactRecord` | Vista offline principale di un Contact. |
| `Contact.create` | `createContactRecord` | Creazione di un nuovo Contact con esempio di lookup offline su Account. |
| `Contact.edit` | `editContactRecord` | Modifica di un Contact. |
| `Opportunity.view` | `viewOpportunityRecord` | Vista offline principale di una Opportunity. |
| `Opportunity.create` | `createOpportunityRecord` | Creazione di una Opportunity. |
| `Opportunity.edit` | `editOpportunityRecord` | Modifica di una Opportunity. |
| `Opportunity.relatedQuotes` | `opportunityRelatedQuotes` | Elenco delle quote collegate a una Opportunity. |
| `Opportunity.relatedFiles` | `recordRelatedFiles` | Elenco file collegati a una Opportunity. |
| `Visit__c.view` | `viewVisitRecord` | Vista offline principale di una visita. |
| `Visit__c.edit` | `editVisitRecord` | Checkout/modifica della visita. |
| `Visit__c.fileUpload` | `fileUpload` | Upload di file sulla visita. |
| `Visit__c.relatedFiles` | `recordRelatedFiles` | Elenco file collegati alla visita. |
| `StarterKitCustomObject__c.view` | `viewStarterKitCustomObjectRecord` | Vista dell'oggetto custom di esempio. |
| `StarterKitCustomObject__c.create` | `createStarterKitCustomObjectRecord` | Creazione dell'oggetto custom di esempio. |
| `StarterKitCustomObject__c.edit` | `editStarterKitCustomObjectRecord` | Modifica dell'oggetto custom di esempio. |
| `Product2.view` | `viewProduct2Record` | Vista di un prodotto, usata anche dal barcode lookup. |
| `Quote.view` | `viewQuoteRecord` | Vista di una quote. |
| `QuoteLineItem.view` | `viewQuoteLineItemRecord` | Vista di una riga quote. |
| `Task.view` | `viewTaskRecord` | Vista di un task. |
| `Event.view` | `viewEventRecord` | Vista di un event. |
| `scanBarcodeLookup` | `scanBarcodeLookup` | Global action per ricerca prodotto via scansione barcode. |

## Altri metadati importanti

### Apex

| Elemento | Scopo |
| --- | --- |
| `AccountController` | Espone `getAccountList()` per la demo `viewAccountsWithApex`. |
| `VisitAIUpdater` | Metodo invocabile da Flow che aggiorna `Visit__c` partendo da un payload JSON; utile per integrazioni AI/server-side dopo il salvataggio. |

### Oggetto custom di esempio

| Elemento | Scopo |
| --- | --- |
| `StarterKitCustomObject__c` | Oggetto custom incluso per mostrare come rendere offline-ready anche un'entita' personalizzata. |
| `Offline_Custom_Objects.permissionset-meta.xml` | Permission set per dare accesso all'oggetto custom e ai campi. |
| `StarterKitCustomObject__c.tab-meta.xml` | Tab del custom object. |
| `StarterKitCustomObject__c-StarterKitCustomObject Layout.layout-meta.xml` | Layout con quick action associate. |

### Static resources / landing page

Nel progetto sono presenti varie configurazioni JSON della landing page offline:

- `landing_page_default`
- `landing_page_healthcare`
- `landing_page_case_management`
- `landing_page_retail_execution`

Servono come esempi di configurazione dell'home/landing page dell'app mobile offline, inclusa l'esposizione di quick action globali come il barcode lookup.

## Casi d'uso coperti dal progetto

Questo starter kit copre bene questi scenari:

- consultare record gia' primati nel Briefcase quando il device e' offline
- creare o modificare record e sincronizzarli successivamente
- esplorare related list offline
- cercare record nei lookup offline
- allegare file al record
- usare funzionalita' native del dispositivo dal mobile container Salesforce
- modellare un oggetto custom offline-ready

## Prerequisiti minimi

- Salesforce CLI
- Visual Studio Code con Salesforce Extension Pack
- un org con Mobile Offline abilitato
- un Briefcase configurato con gli oggetti che vuoi rendere disponibili offline

## Setup rapido

```sh
git clone <repo>
cd offline-app-developer-starter-kit-main
npm install
sf org login web
sf project deploy start
```

Dopo il deploy:

1. configura il Briefcase con gli oggetti rilevanti
2. aggiungi le quick action ai page layout mobile
3. assegna eventuali permission set necessari
4. apri la Salesforce Mobile App e attendi il priming offline

## Ordine consigliato di lettura del codice

Se vuoi capire il progetto rapidamente, conviene partire da questi elementi:

1. `viewAccountRecord` e `Account.view`
2. `createContactRecord` per il lookup offline
3. `accountRelatedContacts` o `accountRelatedOpportunities` per le related list GraphQL
4. `scanBarcodeLookup` per le mobile capabilities
5. `fileUpload` per l'upload allegati
6. `viewVisitRecord` ed `editVisitRecord` per la personalizzazione di business su `Visit__c`

## Documentazione di approfondimento

- [docs/BarcodeScanner.md](docs/BarcodeScanner.md)
- [docs/RelatedRecords.md](docs/RelatedRecords.md)
- [docs/OfflineLookups.md](docs/OfflineLookups.md)
- [docs/CustomObject.md](docs/CustomObject.md)

## Note operative

- I componenti che usano GraphQL dipendono dal corretto priming dei dati nel Briefcase.
- Le quick action `*.view`, `*.create` e `*.edit` devono rispettare esattamente il naming richiesto da Salesforce Mobile Offline.
- L'esempio `viewAccountsWithApex` e' utile per dimostrare un'integrazione Apex, ma per la vera operativita' offline e' generalmente preferibile usare UI API/LDS dove possibile.
