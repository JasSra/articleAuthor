/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QueryParam } from './QueryParam';
import type { Reducer } from './Reducer';
import type { SortBy } from './SortBy';

export type QueryRequest = {
    title?: string | null;
    index?: string | null;
    cursor?: number;
    module?: string | null;
    entity?: string | null;
    type?: QueryRequest.type;
    filters?: Array<QueryParam> | null;
    groupBy?: Array<string> | null;
    conjunction?: QueryRequest.conjunction;
    page?: number | null;
    pageSize?: number | null;
    sortBy?: SortBy;
    aggregateSortBy?: Array<SortBy> | null;
    reducers?: Array<Reducer> | null;
};

export namespace QueryRequest {

    export enum type {
        SEARCH = 'Search',
        AGGREGATE = 'Aggregate',
    }

    export enum conjunction {
        AND = 'And',
        OR = 'Or',
    }


}
