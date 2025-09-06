/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BusinessSearchResult } from './BusinessSearchResult';
import type { EntityStatusResult } from './EntityStatusResult';
import type { GoodsAndServicesTaxResult } from './GoodsAndServicesTaxResult';
import type { MainBusinessPhysicalAddressResult } from './MainBusinessPhysicalAddressResult';
import type { MainNameResult } from './MainNameResult';
import type { MainTradingNameResult } from './MainTradingNameResult';

export type BusinessLookupResult = {
    abns?: Array<string> | null;
    acn?: string | null;
    asics?: Array<string> | null;
    entityNames?: Array<string> | null;
    tradingNames?: Array<string> | null;
    entityTypes?: Array<string> | null;
    statuses?: Array<string> | null;
    entityStatuses?: Array<EntityStatusResult> | null;
    addresses?: Array<string> | null;
    mainNames?: Array<MainNameResult> | null;
    mainTradingNames?: Array<MainTradingNameResult> | null;
    mainBusinessPhysicalAddresses?: Array<MainBusinessPhysicalAddressResult> | null;
    goodsAndServicesTaxes?: Array<GoodsAndServicesTaxResult> | null;
    searchResults?: Array<BusinessSearchResult> | null;
    exception?: string | null;
    numberOfRecords?: number;
    exceedsMaximum?: boolean;
    dateTimeRetrieved?: string | null;
    dateRegisterLastUpdated?: string | null;
    usageStatement?: string | null;
};

