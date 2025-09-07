/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { SiteContent } from './SiteContent';

export type SiteContentOperationResult = {
    outcome?: SiteContentOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: SiteContent;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace SiteContentOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
