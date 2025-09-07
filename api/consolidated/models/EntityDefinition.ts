/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FieldDefinition } from './FieldDefinition';
import type { FormDefinition } from './FormDefinition';
import type { IndexDefinition } from './IndexDefinition';
import type { RelationshipDefinition } from './RelationshipDefinition';
import type { RuleDefinition } from './RuleDefinition';
import type { ViewDefinition } from './ViewDefinition';

export type EntityDefinition = {
    id?: string | null;
    name?: string | null;
    module?: string | null;
    description?: string | null;
    internalIdFormat?: string | null;
    supportVectors?: boolean | null;
    supportStrictFieldValidations?: boolean | null;
    displayField?: string | null;
    fields?: Array<FieldDefinition> | null;
    relationships?: Array<RelationshipDefinition> | null;
    rules?: Array<RuleDefinition> | null;
    forms?: Array<FormDefinition> | null;
    views?: Array<ViewDefinition> | null;
    indices?: Array<IndexDefinition> | null;
    isAuditEnabled?: boolean;
    pluralName?: string | null;
    schemaName?: string | null;
    primaryColumn?: string | null;
    version?: number;
    stateDefinitions?: Array<string> | null;
    isStrictIdNamingCheckEnabled?: boolean;
    minReadPermission?: EntityDefinition.minReadPermission;
    minWritePermission?: EntityDefinition.minWritePermission;
    minDeletePermission?: EntityDefinition.minDeletePermission;
    minQueryPermission?: EntityDefinition.minQueryPermission;
    shouldPublishJobs?: boolean;
    additionalQueuesOnCreate?: Array<string> | null;
    additionalQueuesOnUpdate?: Array<string> | null;
    additionalQueuesOnDelete?: Array<string> | null;
};

export namespace EntityDefinition {

    export enum minReadPermission {
        NONE = 'None',
        READ = 'Read',
        QUERY = 'Query',
        CREATE = 'Create',
        WRITE = 'Write',
        DELETE = 'Delete',
        EXECUTE = 'Execute',
        SHARE = 'Share',
        MANAGE = 'Manage',
        ADMIN = 'Admin',
    }

    export enum minWritePermission {
        NONE = 'None',
        READ = 'Read',
        QUERY = 'Query',
        CREATE = 'Create',
        WRITE = 'Write',
        DELETE = 'Delete',
        EXECUTE = 'Execute',
        SHARE = 'Share',
        MANAGE = 'Manage',
        ADMIN = 'Admin',
    }

    export enum minDeletePermission {
        NONE = 'None',
        READ = 'Read',
        QUERY = 'Query',
        CREATE = 'Create',
        WRITE = 'Write',
        DELETE = 'Delete',
        EXECUTE = 'Execute',
        SHARE = 'Share',
        MANAGE = 'Manage',
        ADMIN = 'Admin',
    }

    export enum minQueryPermission {
        NONE = 'None',
        READ = 'Read',
        QUERY = 'Query',
        CREATE = 'Create',
        WRITE = 'Write',
        DELETE = 'Delete',
        EXECUTE = 'Execute',
        SHARE = 'Share',
        MANAGE = 'Manage',
        ADMIN = 'Admin',
    }


}
