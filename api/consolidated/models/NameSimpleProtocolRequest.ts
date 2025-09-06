/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StateFilters } from './StateFilters';

export type NameSimpleProtocolRequest = {
    name: string;
    postcode?: string | null;
    legalName?: string | null;
    tradingName?: string | null;
    businessName?: string | null;
    activeABNsOnly?: string | null;
    stateFilters?: StateFilters;
    searchWidth?: number;
    minimumScore?: number;
    maxSearchResults?: number;
};

