/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { IdpConfiguration } from './IdpConfiguration';

export type IdpConfigurationListOperationResult = {
    outcome?: IdpConfigurationListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<IdpConfiguration> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace IdpConfigurationListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

