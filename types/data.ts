export interface FormData {
    description: string;
    sku: string;
    parentSku: string;
    name: string;
    productUrl: string;
    categories: string[];
    "categories.lvl0":string[];
    "categories.lvl1": string[];
    "categories.lvl2": string[];
    "categories.lvl3": string[];
    searchKeyword:string
}

export interface TableItem {
    id: string;
    sku: string;
    name: string;
    productUrl: string;
    categories: string[];
    "categories.lvl0":string[];
    "categories.lvl1": string[];
    "categories.lvl2": string[];
    "categories.lvl3": string[];
    description: string;
    variants: string[];
    parentSku: string
}

export interface ListItem extends FormData {
    id: number;
}

export interface StringKeyValue {
    [key: string]: string;
}
