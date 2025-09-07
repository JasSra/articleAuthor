/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityValidationError } from './EntityValidationError';
import type { UserResponse } from './UserResponse';

export type UserResponseOperationResult = {
    outcome?: UserResponseOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: UserResponse;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace UserResponseOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}
