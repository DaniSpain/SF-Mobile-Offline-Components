import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { graphql, gql } from "lightning/uiGraphQLApi";

// eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-unresolved-parent-class-reference
export default class OpportunityRelatedQuotes extends NavigationMixin(
  LightningElement,
) {
  @api recordId;
  isLoading = true;
  offline = false;
  hasMore = false;
  error = null;
  hasData = false;
  showEmpty = false;

  /*
    There is a currently Known Issue {@link https://issues.salesforce.com/issue/a028c00000xGGwE/graphql-query-fails-prefetch-with-an-unknown-field-warning} with GraphQL wire adapters where this will cause the component to fail to load offline.   
    There is a workaround that can be implemented in this Knowledge Article {@link https://help.salesforce.com/s/articleView?language=en_US&id=000396405&type=1}.
    As of Spring '24 release the issue has been addressed.
  */
  get opportunityQuery() {
    return !this.recordId
      ? undefined
      : gql`
          query opportunityWithChildQuotes($recordId: ID) {
            uiapi {
              query {
                Opportunity(where: { Id: { eq: $recordId } }) {
                  edges {
                    node {
                      Quotes {
                        edges {
                          node {
                            Id
                            Name {
                              value
                            }
                            Status {
                              value
                            }
                            GrandTotal {
                              value
                            }
                            QuoteNumber {
                              value
                            }
                            CreatedDate {
                              value
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
  }

  // https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_graphql_relationships
  //
  // eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-wire-adapter-of-resource-cannot-be-primed
  @wire(graphql, {
    query: "$opportunityQuery",
    variables: "$graphqlVariables",
    operationName: "opportunityWithChildQuotes",
  })
  graphqlResult({ data, errors }) {
    this.isLoading = false;
    
    if (errors) {
      console.error("graphql error");
      console.error(errors);
      this.error = errors;
      this.hasData = false;
      this.showEmpty = false;
      return;
    }
    
    this.quotes = null;
    const opportunities = data?.uiapi?.query?.Opportunity?.edges;
    if (opportunities && opportunities[0]) {
      this.quotes = opportunities[0].node.Quotes.edges.map((e) => e.node);
      this.hasData = this.quotes.length > 0;
      this.showEmpty = this.quotes.length === 0;
    } else {
      this.hasData = false;
      this.showEmpty = true;
    }
    console.log("graphql ok");
    console.log(this.quotes);
  }
  quotes;

  get graphqlVariables() {
    return {
      recordId: this.recordId,
    };
  }

  quoteClick(event) {
    const id = event.currentTarget.dataset.id;
    this[NavigationMixin.Navigate]({
      type: "standard__quickAction",
      attributes: {
        actionName: "Quote.view",
      },
      state: {
        recordId: id,
        objectApiName: "Quote",
      },
    });
  }
}
