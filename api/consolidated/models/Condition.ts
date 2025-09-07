/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Argument } from './Argument';

export type Condition = {
    left?: Argument;
    right?: Argument;
    operator?: Condition.operator;
};

export namespace Condition {

    export enum operator {
        BETWEEN = 'Between',
        BETWEEN_WITH_EQUALS = 'BetweenWithEquals',
        NOT_BETWEEN = 'NotBetween',
        EQ = 'Eq',
        NE = 'Ne',
        GT = 'Gt',
        GTE = 'Gte',
        LT = 'Lt',
        LTE = 'Lte',
        LIKE = 'Like',
        NOT_LIKE = 'NotLike',
        REGEX = 'Regex',
        IN = 'In',
        NOT_IN = 'NotIn',
        IS_NULL = 'IsNull',
        IS_NOT_NULL = 'IsNotNull',
        IS_EMPTY = 'IsEmpty',
        IS_NOT_EMPTY = 'IsNotEmpty',
        FULL_TEXT = 'FullText',
        FUZZY1 = 'Fuzzy1',
        FUZZY2 = 'Fuzzy2',
        FUZZY3 = 'Fuzzy3',
        CONTAINS = 'Contains',
        CONTAINS_ALL = 'ContainsAll',
        CONTAINS_ANY = 'ContainsAny',
        CONTAIN_SOME = 'ContainSome',
        STR_EQUALS = 'StrEquals',
        STR_NOT_EQUALS = 'StrNotEquals',
        STR_CONTAINS = 'StrContains',
        STR_STARTS_WITH = 'StrStartsWith',
        STR_ENDS_WITH = 'StrEndsWith',
        TAG = 'Tag',
    }


}
