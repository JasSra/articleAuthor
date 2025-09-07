/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { OtpConfiguration } from './OtpConfiguration';

export type OtpConfigurationOperationResult = {
    outcome?: OtpConfigurationOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: OtpConfiguration;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace OtpConfigurationOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
