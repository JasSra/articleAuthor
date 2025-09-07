/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SuggestedEntityDefinition } from './SuggestedEntityDefinition';
import type { SuggestedField } from './SuggestedField';

export type EntityDefinitionSuggestionResponse = {
    suggestedDefinition?: SuggestedEntityDefinition;
    alternativeFields?: Array<SuggestedField> | null;
    confidenceScore?: number;
    reasoning?: string | null;
    warnings?: Array<string> | null;
};
