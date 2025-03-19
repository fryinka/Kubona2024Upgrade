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
export interface Prodlist {
    itemGroupId: number;
    departmentId: number;
    title: string;
    sizeDesc: string;
    colorDesc: string;
    departmentName: string;
    numAvailable: number;
    styleDesc: string;
    colorId: number;
    trackingId: string;
    brandId: number;
    styleId: number;
    internetPrice: number;
    storePrice: number;
    similarId: string;
    image1Url: string;
    image2Url: string;
    numOfViews: number;
    description: string;
    youTubeId: string;
    tfItemsgroupSizes: Sizelist[];
    destinationUrl: string;
    positionId: number;
    materialId: number;
    heelHeightId: number;
    heelHeight: string;
}

export interface SlideShowImages {
    id: string;
    imageUrl: string;
    title: string;
    category: string;
    description: string;
    createdAt: Date;
}

export interface ImageRotators {
    imageurl: string;
    imageTitle: string;
    summary: string;
    routeUrl: string;
    routeId: string;
}

export interface CategoryTitle {
    categoryId: number;
    categoryDesc: string;
    urlId: string;
  }

  export interface OtherColors {
    title: string;
    mobileImageUrl: string;
    urlId: string;
    productId: number;
    internetPrice: number;
  }
  
  export interface MenuLinks {
    linkId: number;
    shortTitle: string;
    routeId: string;
    routeUrl: string;
  }
  
  export interface RelatedProducts {
    itemgroupId: number,
    title: string,
    internetPrice: number,
    imageUrl: string,
    urlId: string
  }

  export interface RecentlyViewed {
    itemId: number;
    title: string;
    imageUrl: string;
    internetPrice: number;
    urlId: string;
    viewDate: Date;
  }

  export interface ProductImages {
    orderId: number;
    image: string;
    thumbImage: string;
    alt: string;
    title: string;
  }
  export interface ContactUs {
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
  }
  export interface Reviews 
    {
      reviewId: number,
      customerGSM: string,
      reviewerName: string,
      productId: number,
      rating: number,
      imageUrl: string,
      reviewTitle: string,
      dateAdded: Date,
      datePurchased: Date,
      isApproved: boolean,
      fullReview: string,
      addedby: string
    }
    export interface HeelHeight {
      heelHeightId: number;
      desc: string;
    }
    export interface CustDetails {
      curationId: string;
      customerName: string;
    }
    
    export interface CuratedForCust {
      itemgroupId: number;
      title: string;
      internetPrice: number;
      imageUrl: string;
      destinationUrl: string;
    }
    
    export interface UserData {
      client_ip_address: string;
      client_user_agent: string;
      fbc: string;
      fbp: string;
      em: string[];
    }
    
    export interface CustomData {
      currency: string;
      value: string;
    }
    
    export interface EventData {
      event_name: string;
      event_time: number;
      action_source: string;
      event_id: string;
      original_event_data: {
        event_name: string;
        event_time: number;
      };
      event_source_url: string;
      user_data: UserData;
      custom_data: CustomData;
    }
    
    export interface EventOutput {
      data: EventData[];
      test_event_code: string;
    }