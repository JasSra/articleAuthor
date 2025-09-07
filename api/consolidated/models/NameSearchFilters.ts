/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NameTypeFilters } from './NameTypeFilters';
import type { StateFilters } from './StateFilters';

export type NameSearchFilters = {
    nameType?: NameTypeFilters;
    postcode?: string | null;
    stateCode?: StateFilters;
    activeABNsOnly?: string | null;
};
