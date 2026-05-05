export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    sizes?: string[]; // Available sizes
    selectedSize?: string;
}

export interface CartItem extends Product {
    quantity: number;
    size?: string; // Selected size in cart
}
