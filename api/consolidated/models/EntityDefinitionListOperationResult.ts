/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityDefinition } from './EntityDefinition';
import type { EntityValidationError } from './EntityValidationError';

export type EntityDefinitionListOperationResult = {
    outcome?: EntityDefinitionListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<EntityDefinition> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace EntityDefinitionListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
