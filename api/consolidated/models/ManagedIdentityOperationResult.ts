/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { ManagedIdentity } from './ManagedIdentity';

export type ManagedIdentityOperationResult = {
    outcome?: ManagedIdentityOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: ManagedIdentity;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace ManagedIdentityOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

