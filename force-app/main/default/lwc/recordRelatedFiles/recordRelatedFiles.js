import { LightningElement, api, wire } from "lwc";
import { graphql, gql } from "lightning/uiGraphQLApi";

export default class RecordRelatedFiles extends LightningElement {
    @api recordId;

    files;

    get filesQuery() {
        return !this.recordId
            ? undefined
            : gql`
                query filesByRecord($recordId: ID) {
                    uiapi {
                        query {
                            ContentDocumentLink(
                                where: { LinkedEntityId: { eq: $recordId } }
                                orderBy: {
                                    ContentDocument: { CreatedDate: { order: DESC } }
                                }
                                first: 50
                            ) {
                                edges {
                                    node {
                                        ContentDocument {
                                            Id
                                            Title {
                                                value
                                            }
                                            FileExtension {
                                                value
                                            }
                                            FileType {
                                                value
                                            }
                                            LatestPublishedVersion {
                                                Id
                                                VersionDataUrl {
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
            `;
    }

    get graphqlVariables() {
        return {
            recordId: this.recordId
        };
    }

    // eslint-disable-next-line @salesforce/lwc-graph-analyzer/no-wire-adapter-of-resource-cannot-be-primed
    @wire(graphql, {
        query: "$filesQuery",
        variables: "$graphqlVariables",
        operationName: "filesByRecord"
    })
    graphqlResult({ data /*, errors*/ }) {
        const edges = data?.uiapi?.query?.ContentDocumentLink?.edges;

        if (!edges || edges.length === 0) {
            this.files = null;
            return;
        }

        this.files = edges.map((edge) => {
            const doc = edge.node.ContentDocument;
            const title = doc.Title?.value;
            const fileType = (doc.FileType?.value || "").toLowerCase();
            const ext = (doc.FileExtension?.value || "").toLowerCase();

            const versionDataUrl =
                doc.LatestPublishedVersion?.VersionDataUrl?.value;

            // Heuristica per capire se è immagine
            const imageExtensions = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
                "heic"
            ];
            const isImage = fileType === "image" || imageExtensions.includes(ext);

            // Per le immagini usiamo direttamente VersionDataUrl (+ thumb opzionale)
            let imageUrl;
            if (isImage && versionDataUrl) {
                // la guida suggerisce l’uso del parametro thumb per le renditions
                imageUrl = `${versionDataUrl}?thumb=THUMB240BY180`;
            }

            // URL di download/preview standard (online)
            let downloadUrl = versionDataUrl;
            // fallback, nel caso VersionDataUrl non fosse disponibile
            if (!downloadUrl) {
                const versionId = doc.LatestPublishedVersion?.Id;
                downloadUrl = versionId
                    ? `/sfc/servlet.shepherd/version/download/${versionId}`
                    : `/sfc/servlet.shepherd/document/download/${doc.Id}`;
            }

            return {
                id: doc.Id,
                title,
                extension: ext,
                fileType,
                isImage,
                imageUrl,
                downloadUrl
            };
        });
    }

    handleFileClick(event) {
        const fileId = event.currentTarget.dataset.id;
        const file = this.files?.find((f) => f.id === fileId);
        if (!file) return;

        // online -> prova ad aprire il file nel browser / viewer
        if (navigator.onLine) {
            window.open(file.downloadUrl, "_blank");
        } else {
            // offline -> messaggio esplicito all’utente
            // eslint-disable-next-line no-alert
            alert(
                "Questo file potrebbe non essere disponibile offline. Riprova quando sei connesso a Internet."
            );
        }
    }
}
