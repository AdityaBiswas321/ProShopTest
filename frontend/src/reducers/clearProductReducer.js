import { CLEAR_PRODUCT_DETAILS } from '../constants/productConstants'

export const clearProductReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case CLEAR_PRODUCT_DETAILS:
      return { loading: true, product: { reviews: [] } }
    default:
      return state
  }
}
