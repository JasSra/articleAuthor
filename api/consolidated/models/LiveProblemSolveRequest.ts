/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LiveProblemSolveHttpCall } from './LiveProblemSolveHttpCall';

export type LiveProblemSolveRequest = {
    description?: string | null;
    allowedUrls?: Array<string> | null;
    defaultHeaders?: Record<string, string> | null;
    initialHttpCall?: LiveProblemSolveHttpCall;
    maxLoops?: number | null;
};
