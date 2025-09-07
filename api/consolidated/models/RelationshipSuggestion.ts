/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SuggestedRelationship } from './SuggestedRelationship';

export type RelationshipSuggestion = {
    success?: boolean;
    confidence?: number;
    suggestedRelationships?: Array<SuggestedRelationship> | null;
    errorMessage?: string | null;
};
