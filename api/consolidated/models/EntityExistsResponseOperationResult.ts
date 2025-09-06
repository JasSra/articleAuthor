/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityExistsResponse } from './EntityExistsResponse';
import type { EntityValidationError } from './EntityValidationError';

export type EntityExistsResponseOperationResult = {
    outcome?: EntityExistsResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: EntityExistsResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace EntityExistsResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

