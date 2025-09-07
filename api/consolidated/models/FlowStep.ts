/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Argument } from './Argument';
import type { WorkflowCondition } from './WorkflowCondition';

export type FlowStep = {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    continueOnError?: boolean;
    component?: string | null;
    operation?: string | null;
    next?: string | null;
    inputs?: Array<Argument> | null;
    outputs?: Array<Argument> | null;
    preConditions?: Array<WorkflowCondition> | null;
    postConditions?: Array<WorkflowCondition> | null;
    timeout?: number | null;
};
