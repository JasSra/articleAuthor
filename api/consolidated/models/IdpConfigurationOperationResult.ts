/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { IdpConfiguration } from './IdpConfiguration';

export type IdpConfigurationOperationResult = {
    outcome?: IdpConfigurationOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: IdpConfiguration;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace IdpConfigurationOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

