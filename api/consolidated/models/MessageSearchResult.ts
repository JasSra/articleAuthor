/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Message } from './Message';

export type MessageSearchResult = {
    items?: Array<Message> | null;
    page?: number;
    size?: number;
    total?: number;
    errors?: Array<string> | null;
    queryUsed?: string | null;
    indexUsed?: string | null;
};
