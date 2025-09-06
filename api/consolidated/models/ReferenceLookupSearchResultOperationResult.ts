/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { ReferenceLookupSearchResult } from './ReferenceLookupSearchResult';

export type ReferenceLookupSearchResultOperationResult = {
    outcome?: ReferenceLookupSearchResultOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: ReferenceLookupSearchResult;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace ReferenceLookupSearchResultOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

