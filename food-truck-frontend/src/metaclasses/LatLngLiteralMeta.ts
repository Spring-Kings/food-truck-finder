import * as t from 'io-ts'

export const LatLngLiteralMeta = t.type({
  lat: t.number,
  lng: t.number
})

export default LatLngLiteralMeta