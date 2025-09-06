/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryParam } from './QueryParam';
import type { TransitionAction } from './TransitionAction';

export type StateTransition = {
    fromState?: string | null;
    toState?: string | null;
    conditions?: Array<QueryParam> | null;
    actions?: Array<TransitionAction> | null;
    metadata?: Record<string, any> | null;
};

