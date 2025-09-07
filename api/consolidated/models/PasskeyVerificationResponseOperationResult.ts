/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { PasskeyVerificationResponse } from './PasskeyVerificationResponse';

export type PasskeyVerificationResponseOperationResult = {
    outcome?: PasskeyVerificationResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: PasskeyVerificationResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace PasskeyVerificationResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
