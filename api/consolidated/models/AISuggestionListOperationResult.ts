/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AISuggestion } from './AISuggestion';
import type { EntityValidationError } from './EntityValidationError';

export type AISuggestionListOperationResult = {
    outcome?: AISuggestionListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<AISuggestion> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace AISuggestionListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
