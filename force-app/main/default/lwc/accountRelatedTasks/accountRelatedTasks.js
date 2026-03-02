import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { graphql, gql } from "lightning/uiGraphQLApi";

// eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-unresolved-parent-class-reference
export default class AccountRelatedTasks extends NavigationMixin(
    LightningElement
) {
    @api recordId;
    tasks;

    /*
        Nota offline:
        C'è un Known Issue sui wire GraphQL per l'offline (vedi commento nel componente contatti).
        Dalla Spring '24 dovrebbe essere risolto, ma la struttura rimane analoga.
    */
    get tasksQuery() {
        return !this.recordId
            ? undefined
            : gql`
                query tasksByAccount($recordId: ID) {
                    uiapi {
                        query {
                            Task(
                                where: { WhatId: { eq: $recordId } }
                                orderBy: { ActivityDate: { order: DESC } }
                                first: 20
                            ) {
                                edges {
                                    node {
                                        Id
                                        Subject {
                                            value
                                        }
                                        Status {
                                            value
                                        }
                                        Type {
                                            value
                                        }
                                        ActivityDate {
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
        query: "$tasksQuery",
        variables: "$graphqlVariables",
        operationName: "tasksByAccount"
    })
    graphqlResult({ data /*, errors*/ }) {
        this.tasks = null;
        const edges = data?.uiapi?.query?.Task?.edges;
        if (edges && edges.length > 0) {
            this.tasks = edges.map((e) => e.node);
        }
    }

    taskClick(event) {
        const { id } = event.currentTarget.dataset;
        this[NavigationMixin.Navigate]({
            type: "standard__quickAction",
            attributes: {
                actionName: "Task.view"
            },
            state: {
                recordId: id,
                objectApiName: "Task"
            }
        });
    }
}
