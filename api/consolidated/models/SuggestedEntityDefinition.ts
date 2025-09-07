/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SuggestedField } from './SuggestedField';
import type { SuggestedRelationship } from './SuggestedRelationship';

export type SuggestedEntityDefinition = {
    name?: string | null;
    module?: string | null;
    description?: string | null;
    internalIdFormat?: string | null;
    pluralName?: string | null;
    schemaName?: string | null;
    primaryColumn?: string | null;
    displayField?: string | null;
    isAuditEnabled?: boolean;
    supportVectors?: boolean;
    supportStrictFieldValidations?: boolean;
    fields?: Array<SuggestedField> | null;
    relationships?: Array<SuggestedRelationship> | null;
    additionalQueuesOnCreate?: Array<string> | null;
    additionalQueuesOnUpdate?: Array<string> | null;
    additionalQueuesOnDelete?: Array<string> | null;
};
