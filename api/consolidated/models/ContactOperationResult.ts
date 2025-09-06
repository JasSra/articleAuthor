/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Contact } from './Contact';
import type { EntityValidationError } from './EntityValidationError';

export type ContactOperationResult = {
    outcome?: ContactOperationResult.outcome;
    errors?: Array<EntityValidationError> | null;
    data?: Contact;
    correlationId?: string | null;
    status?: number;
    message?: string | null;
    trace?: string | null;
};

export namespace ContactOperationResult {

    export enum outcome {
        SUCCESS = 'Success',
        FAILURE = 'Failure',
    }


}

