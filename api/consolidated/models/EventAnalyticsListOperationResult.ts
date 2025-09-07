/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { EventAnalytics } from './EventAnalytics';

export type EventAnalyticsListOperationResult = {
    outcome?: EventAnalyticsListOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Array<EventAnalytics> | null;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace EventAnalyticsListOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
