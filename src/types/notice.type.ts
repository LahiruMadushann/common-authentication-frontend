interface NoticeType {
    id: number;
    title: string;
    content: string;
    author: string;
    created: string;
    published: string;
    updatedLast: string;
    approvedBy: string | null;
    updatedBy: string;
    isPin: boolean;
    category: string;
}

interface SortOrder {
    direction: "ASC" | "DESC";
    property: string;
    ignoreCase: boolean;
    nullHandling: "NATIVE" | "NULLS_FIRST" | "NULLS_LAST";
}

interface Pageable {
    page: number;
    size: number;
    sort: {
        orders: SortOrder[];
    };
}

interface NoticesResponseType {
    content: NoticeType[];
    pageable: Pageable;
    total: number;
}

interface NoticeParamsType {
    page: number,
    size: number,
    category: string
}

export type {
    NoticeType,
    NoticeParamsType,
    NoticesResponseType
}