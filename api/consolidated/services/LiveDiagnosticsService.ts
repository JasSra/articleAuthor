/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiveProblemSolveRequest } from '../models/LiveProblemSolveRequest';
import type { LiveProblemSolveResult } from '../models/LiveProblemSolveResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LiveDiagnosticsService {

    /**
     * @param requestBody 
     * @returns LiveProblemSolveResult OK
     * @throws ApiError
     */
    public static postApiAiLiveSolve(
requestBody?: LiveProblemSolveRequest,
): CancelablePromise<LiveProblemSolveResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/live/solve',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
