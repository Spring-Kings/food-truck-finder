interface Truck {
  id: number;
  userId: number;
  name: string;
  textMenu: string | null;
  priceRating: number | null;
  starRating: number | null;
  description: string | null;
  foodCategory: string | null;
}

export const emptyTruck = () => ({
  id: 0,
  userId: 0,
  name: "",
  textMenu: null,
  priceRating: null,
  starRating: null,
  description: null,
  foodCategory: null,
});

export const backendToFrontend = (obj: any): Truck => ({
  id: obj.id,
  userId: obj.userId,
  name: obj.name,
  textMenu: obj.textMenu,
  priceRating: obj.priceRating,
  starRating: obj.starRating,
  description: obj.description,
  foodCategory: obj.foodCategory,
});

// May change as the truck representation develops
export const frontendToBackend = (truck: Truck) => ({
  id: truck.id,
  userId: truck.userId,
  name: truck.name,
  textMenu: truck.textMenu,
  priceRating: truck.priceRating,
  starRating: truck.starRating,
  description: truck.description,
  foodCategory: truck.foodCategory,
});

export default Truck;
