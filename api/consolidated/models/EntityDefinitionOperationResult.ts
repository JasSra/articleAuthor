/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityDefinition } from './EntityDefinition';
import type { EntityValidationError } from './EntityValidationError';

export type EntityDefinitionOperationResult = {
    outcome?: EntityDefinitionOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: EntityDefinition;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace EntityDefinitionOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
