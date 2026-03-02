import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { graphql, gql } from 'lightning/uiGraphQLApi';

const PAGE_SIZE = 50;

export default class AccountRelatedOpportunities extends NavigationMixin(LightningElement) {
    @api recordId;

    opportunities = [];
    error;

    /*
      There is a currently Known Issue https://issues.salesforce.com/issue/a028c00000xGGwE/graphql-query-fails-prefetch-with-an-unknown-field-warning with GraphQL wire adapters where this will cause the component to fail to load offline.
      There is a workaround that can be implemented in this Knowledge Article https://help.salesforce.com/s/articleView?language=en_US&id=000396405&type=1.
      As of Spring '24 release the issue has been addressed.
    */
    get accountOppQuery() {
        return !this.recordId
            ? undefined
            : gql`
                query RelatedOpps($accountId: ID!, $pageSize: Int!) {
                  uiapi {
                    query {
                      Opportunity(
                        where: { AccountId: { eq: $accountId } }
                        orderBy: { CloseDate: { order: DESC } }
                        first: $pageSize
                      ) {
                        edges {
                          node {
                            Id
                            Name { value }
                            StageName { value }
                            Amount { value }
                            CloseDate { value }
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
            accountId: this.recordId,
            pageSize: PAGE_SIZE
        };
    }

    // eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-wire-adapter-of-resource-cannot-be-primed
    @wire(graphql, {
        query: '$accountOppQuery',
        variables: '$graphqlVariables',
        operationName: 'RelatedOpps'
    })
    graphqlResult({ data /*, errors*/ }) {
        this.error = undefined;
        this.opportunities = [];

        const edges = data?.uiapi?.query?.Opportunity?.edges ?? [];
        this.opportunities = edges.map((e) => {
            const n = e?.node ?? {};
            const id = n.Id;
            const name = n?.Name?.value;
            const stageName = n?.StageName?.value;
            const amount = n?.Amount?.value;
            const closeDate = n?.CloseDate?.value;
            return {
                Id: id,
                Name: name,
                StageName: stageName,
                Amount: amount,
                CloseDate: closeDate,
                formattedAmount: this.formatCurrency(amount),
                formattedCloseDate: this.formatDate(closeDate)
            };
        });
    }

    get hasRecords() {
        return Array.isArray(this.opportunities) && this.opportunities.length > 0;
    }

    handleNavigate(event) {
        const id = event.currentTarget?.dataset?.id;
        if (!id) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: id,
                objectApiName: 'Opportunity',
                actionName: 'view'
            }
        });
    }

    formatCurrency(value) {
        if (value === null || value === undefined || isNaN(value)) return '';
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
        } catch (e) {
            return new Intl.NumberFormat().format(value);
        }
    }

    formatDate(value) {
        if (!value) return '';
        try {
            const d = new Date(value);
            if (isNaN(d.getTime())) return '';
            return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
        } catch {
            return '';
        }
    }
}
