/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { ErrorResponse } from './ErrorResponse';

export type ErrorResponseOperationResult = {
    outcome?: ErrorResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: ErrorResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace ErrorResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

