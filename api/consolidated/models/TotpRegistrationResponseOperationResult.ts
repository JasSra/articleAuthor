/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { TotpRegistrationResponse } from './TotpRegistrationResponse';

export type TotpRegistrationResponseOperationResult = {
    outcome?: TotpRegistrationResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: TotpRegistrationResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace TotpRegistrationResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

