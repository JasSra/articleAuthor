/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Argument = {
    type?: Argument.type;
    name?: string | null;
    required?: boolean | null;
    jsonPayload?: any;
    source?: Argument.source;
    direction?: Argument.direction | null;
    schema?: string | null;
    description?: string | null;
    jsonOptions?: string | null;
    optionsDisplayKey?: string | null;
    optionsValueKey?: string | null;
};

export namespace Argument {

    export enum type {
        ARRAY = 'Array',
        BOOLEAN = 'Boolean',
        BYTE_ARRAY = 'ByteArray',
        CHARACTER = 'Character',
        CODE = 'Code',
        DATE_ONLY = 'DateOnly',
        DATE_TIME = 'DateTime',
        DECIMAL = 'Decimal',
        DICTIONARY = 'Dictionary',
        DOUBLE = 'Double',
        ENUM = 'Enum',
        FLOAT = 'Float',
        GUID = 'Guid',
        INTEGER = 'Integer',
        LIST = 'List',
        LONG = 'Long',
        MARKDOWN = 'Markdown',
        OBJECT = 'Object',
        RICH_TEXT = 'RichText',
        SCHEMA = 'Schema',
        STRING = 'String',
        STRING_ARRAY = 'StringArray',
        SUGGESTION = 'Suggestion',
        TIME_SPAN = 'TimeSpan',
        TIME_ONLY = 'TimeOnly',
        VOID = 'Void',
        XML = 'Xml',
    }

    export enum source {
        STATE = 'State',
        ENVIRONMENT = 'Environment',
        PAYLOAD = 'Payload',
        RESPONSE_META = 'ResponseMeta',
        CONSTANT = 'Constant',
    }

    export enum direction {
        IN = 'In',
        OUT = 'Out',
    }


}

