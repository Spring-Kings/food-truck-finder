import * as t from 'io-ts'

export const TruckMeta = t.type({
  id: t.number,
  userId: t.number,
  name: t.string,
  description: t.union([t.string, t.null]),
  priceRating: t.union([t.number, t.null]),
  starRating: t.union([t.number, t.null]),
  tags: t.array(t.string),
  menuContentType: t.union([t.string, t.null])
}, "Truck")

export type Truck = t.TypeOf<typeof TruckMeta>


export const emptyTruck = (): Truck => ({
  id: 0,
  userId: 0,
  name: "",
  priceRating: null,
  starRating: null,
  description: null,
  tags: [],
  menuContentType: null
});

export default Truck;
