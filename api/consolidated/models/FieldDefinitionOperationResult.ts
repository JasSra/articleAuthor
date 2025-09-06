/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { FieldDefinition } from './FieldDefinition';

export type FieldDefinitionOperationResult = {
    outcome?: FieldDefinitionOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: FieldDefinition;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace FieldDefinitionOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

