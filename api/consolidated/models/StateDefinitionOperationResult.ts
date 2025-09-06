/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { StateDefinition } from './StateDefinition';

export type StateDefinitionOperationResult = {
    outcome?: StateDefinitionOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: StateDefinition;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace StateDefinitionOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

