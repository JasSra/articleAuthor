/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';

export type StringObjectDictionaryOperationResult = {
    outcome?: StringObjectDictionaryOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Record<string, any> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace StringObjectDictionaryOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
