/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { TotpVerificationResponse } from './TotpVerificationResponse';

export type TotpVerificationResponseOperationResult = {
    outcome?: TotpVerificationResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: TotpVerificationResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace TotpVerificationResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
