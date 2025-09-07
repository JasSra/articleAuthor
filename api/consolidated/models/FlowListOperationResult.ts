/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { Flow } from './Flow';

export type FlowListOperationResult = {
    outcome?: FlowListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<Flow> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace FlowListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
