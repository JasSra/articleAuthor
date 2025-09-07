/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type IndexDefinition = {
    name?: string | null;
    prefixes?: Array<string> | null;
    description?: string | null;
    noStopWords?: boolean;
    noHighlights?: boolean;
    skipInitialScan?: boolean;
    fields?: Array<string> | null;
    type?: IndexDefinition.type;
};

export namespace IndexDefinition {

    export enum type {
        FULL_TEXT = 'FullText',
        VECTOR = 'Vector',
    }


}
