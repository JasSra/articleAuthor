/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { PasskeyRegistrationResponse } from './PasskeyRegistrationResponse';

export type PasskeyRegistrationResponseOperationResult = {
    outcome?: PasskeyRegistrationResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: PasskeyRegistrationResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace PasskeyRegistrationResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

