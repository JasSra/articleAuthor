/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';

export type StringStringDictionaryListOperationResult = {
    outcome?: StringStringDictionaryListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<Record<string, string>> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace StringStringDictionaryListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
