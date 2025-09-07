/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RelationshipDefinition = {
    name?: string | null;
    description?: string | null;
    fieldId?: string | null;
    isRequired?: boolean;
    relationType?: RelationshipDefinition.relationType;
    targetDefinitionId?: string | null;
    targetModule?: string | null;
    targetEntity?: string | null;
    targetRelationName?: string | null;
};

export namespace RelationshipDefinition {

    export enum relationType {
        ONE_TO_ONE = 'OneToOne',
        ONE_TO_MANY = 'OneToMany',
        MANY_TO_ONE = 'ManyToOne',
        MANY_TO_MANY = 'ManyToMany',
        NONE = 'None',
    }


}
