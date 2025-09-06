/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { TrackEventResponse } from './TrackEventResponse';

export type TrackEventResponseListOperationResult = {
    outcome?: TrackEventResponseListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<TrackEventResponse> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace TrackEventResponseListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

