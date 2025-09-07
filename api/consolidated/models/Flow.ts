/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Argument } from './Argument';
import type { FlowStep } from './FlowStep';

export type Flow = {
    id?: string | null;
    definitionId?: string | null;
    ownerId?: string | null;
    attributes?: Record<string, any> | null;
    createdAt?: number | null;
    updatedAt?: number | null;
    version?: number;
    tags?: Array<string> | null;
    embedding?: Array<number> | null;
    status?: string | null;
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    type?: string | null;
    appId?: string | null;
    inputSchema?: string | null;
    outputSchema?: string | null;
    enabled?: boolean;
    author?: string | null;
    name?: string | null;
    description?: string | null;
    startingStepId?: string | null;
    steps?: Array<FlowStep> | null;
    componentConfigurations?: Record<string, Array<Argument>> | null;
    triggerType?: string | null;
    triggerConfig?: Record<string, string> | null;
    isDeleted?: boolean;
};
