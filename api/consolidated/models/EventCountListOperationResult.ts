/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { EventCount } from './EventCount';

export type EventCountListOperationResult = {
    outcome?: EventCountListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<EventCount> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace EventCountListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
