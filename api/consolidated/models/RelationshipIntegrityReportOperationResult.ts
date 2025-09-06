/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { RelationshipIntegrityReport } from './RelationshipIntegrityReport';

export type RelationshipIntegrityReportOperationResult = {
    outcome?: RelationshipIntegrityReportOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: RelationshipIntegrityReport;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace RelationshipIntegrityReportOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

