/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BusinessApplication } from './BusinessApplication';
import type { EntityValidationError } from './EntityValidationError';

export type BusinessApplicationOperationResult = {
    outcome?: BusinessApplicationOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: BusinessApplication;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace BusinessApplicationOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
