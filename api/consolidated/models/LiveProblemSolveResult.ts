/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LiveProblemSolveStep } from './LiveProblemSolveStep';

export type LiveProblemSolveResult = {
    success?: boolean;
    conclusion?: string | null;
    rootCauseHypothesis?: string | null;
    recommendations?: Array<string> | null;
    steps?: Array<LiveProblemSolveStep> | null;
};
