/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { StringSearchResult } from './StringSearchResult';

export type StringSearchResultOperationResult = {
    outcome?: StringSearchResultOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: StringSearchResult;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace StringSearchResultOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

