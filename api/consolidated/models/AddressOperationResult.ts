/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { EntityValidationError } from './EntityValidationError';

export type AddressOperationResult = {
    outcome?: AddressOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Address;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace AddressOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
