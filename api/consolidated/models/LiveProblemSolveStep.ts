/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LiveProblemSolveHttpCall } from './LiveProblemSolveHttpCall';
import type { LiveProblemSolveHttpResponse } from './LiveProblemSolveHttpResponse';
import type { LiveProblemSolveServiceResponse } from './LiveProblemSolveServiceResponse';
import type { ServiceCall } from './ServiceCall';

export type LiveProblemSolveStep = {
    index?: number;
    action?: string | null;
    reason?: string | null;
    request?: LiveProblemSolveHttpCall;
    response?: LiveProblemSolveHttpResponse;
    service?: ServiceCall;
    serviceResponse?: LiveProblemSolveServiceResponse;
};
