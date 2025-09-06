/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryRequest } from './QueryRequest';
import type { ViewFieldDefinition } from './ViewFieldDefinition';
import type { ViewType } from './ViewType';

export type ViewDefinition = {
    name?: string | null;
    id?: string | null;
    viewType?: ViewType;
    description?: string | null;
    fields?: Array<ViewFieldDefinition> | null;
    configuration?: string | null;
    layout?: string | null;
    query?: QueryRequest;
    icon?: string | null;
    color?: string | null;
    roles?: Array<string> | null;
};

