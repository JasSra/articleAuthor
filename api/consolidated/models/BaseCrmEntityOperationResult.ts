/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseCrmEntity } from './BaseCrmEntity';
import type { EntityValidationError } from './EntityValidationError';

export type BaseCrmEntityOperationResult = {
    outcome?: BaseCrmEntityOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: BaseCrmEntity;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace BaseCrmEntityOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

