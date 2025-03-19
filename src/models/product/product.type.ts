export type CreateProductRequest = {
  name: string;
  description: string;
  categoryId: number;
  shopId: number;
  attributes: {
    name: string;
    values: string[];
  }[];
  variants: {
    price: number;
    stock: number;
    attributes: {
      name: string;
      value: string;
    }[];
  }[];
};

export type CreateProductDTO = CreateProductRequest & {
  imageUrls: string;
};
