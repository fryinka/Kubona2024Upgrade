export interface DepartmentGroup {
    departmentId: number;
    description: string;
    totalCount: number;
    destinationUrl: string;
}

export interface SizeGroup {
    sizeCode: number;
    sizeDesc: string;
    totalcount: number;
    destinationUrl: string;
}
export interface ProductImages {
    orderId: number;
    image: string;
    thumbImage: string;
    alt: string;
    title: string;
}

export interface Sizelist {
    itemGroupSizeId: number;
    itemGroupId: number;
    sizeDesc: string;
    sizeCode: number;
    trackingId: string;
    quantity: number;
}
export interface ColorsGroup {
    colorId: number;
    colorDesc: string;
    totalcount: number;
    destinationUrl: string;
}

export interface StylesGroup {
    styleId: number;
    styleDesc: string;
    totalcount: number;
    destinationUrl: string;
}

export interface HeelHeightGroup {
    heelHeightId: number;
    heelHeightDesc: string;
    totalCount: number;
    destinationUrl: string;
}
export interface MaterialGroup {
    materialId: number;
    materialDesc: string;
    totalCount: number;
    destinationUrl: string;
}  