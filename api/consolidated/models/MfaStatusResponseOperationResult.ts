/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { MfaStatusResponse } from './MfaStatusResponse';

export type MfaStatusResponseOperationResult = {
    outcome?: MfaStatusResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: MfaStatusResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace MfaStatusResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

