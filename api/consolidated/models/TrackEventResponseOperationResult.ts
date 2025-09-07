/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { TrackEventResponse } from './TrackEventResponse';

export type TrackEventResponseOperationResult = {
    outcome?: TrackEventResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: TrackEventResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace TrackEventResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
