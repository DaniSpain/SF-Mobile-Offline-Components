import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { graphql, gql } from "lightning/uiGraphQLApi";

// eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-unresolved-parent-class-reference
export default class AccountRelatedVisits extends NavigationMixin(
    LightningElement
) {
    @api recordId;
    visits;

    /*
        Nota offline:
        C'era un Known Issue sui wire GraphQL in offline (stesso commento del componente contatti).
        Dalla Spring '24 è stato risolto, ma il pattern rimane questo.
    */
    get visitsQuery() {
        return !this.recordId
            ? undefined
            : gql`
                query visitsByAccount($recordId: ID) {
                    uiapi {
                        query {
                            Visit__c(
                                where: { Account__c: { eq: $recordId } }
                                orderBy: { Date__c: { order: DESC } }
                                first: 20
                            ) {
                                edges {
                                    node {
                                        Id
                                        Name {
                                            value
                                        }
                                        Date__c {
                                            value
                                        }
                                        Status__c {
                                            value
                                        }
                                        Type__c {
                                            value
                                        }
                                        Visit_Objective__c {
                                            value
                                        }
                                        Outcome__c {
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;
    }

    get graphqlVariables() {
        return {
            recordId: this.recordId
        };
    }

    // eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-wire-adapter-of-resource-cannot-be-primed
    @wire(graphql, {
        query: "$visitsQuery",
        variables: "$graphqlVariables",
        operationName: "visitsByAccount"
    })
    graphqlResult({ data /*, errors*/ }) {
        this.visits = null;
        const edges = data?.uiapi?.query?.Visit__c?.edges;
        if (edges && edges.length > 0) {
            this.visits = edges.map((e) => e.node);
        }
    }

    visitClick(event) {
        const { id } = event.currentTarget.dataset;

        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: id,
                objectApiName: "Visit__c",
                actionName: "view"
            }
        });
    }
}
