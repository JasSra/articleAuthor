/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StateNode } from './StateNode';
import type { StateTransition } from './StateTransition';

export type StateDefinition = {
    id?: string | null;
    definitionId?: string | null;
    ownerId?: string | null;
    attributes?: Record<string, any> | null;
    isDeleted?: boolean;
    createdAt?: number | null;
    updatedAt?: number | null;
    version?: number;
    tags?: Array<string> | null;
    embedding?: Array<number> | null;
    status?: string | null;
    relatedEntities?: Record<string, Array<string>> | null;
    state?: Record<string, string> | null;
    name?: string | null;
    fieldName?: string | null;
    description?: string | null;
    states?: Array<StateNode> | null;
    transitions?: Array<StateTransition> | null;
    startState?: string | null;
    endStates?: Array<string> | null;
};
