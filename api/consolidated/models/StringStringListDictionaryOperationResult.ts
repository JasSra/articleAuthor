/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';

export type StringStringListDictionaryOperationResult = {
    outcome?: StringStringListDictionaryOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Record<string, Array<string> | null> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace StringStringListDictionaryOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
