/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { Organization } from './Organization';

export type OrganizationOperationResult = {
    outcome?: OrganizationOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Organization;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace OrganizationOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

