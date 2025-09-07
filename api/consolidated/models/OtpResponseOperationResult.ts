/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { OtpResponse } from './OtpResponse';

export type OtpResponseOperationResult = {
    outcome?: OtpResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: OtpResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace OtpResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
