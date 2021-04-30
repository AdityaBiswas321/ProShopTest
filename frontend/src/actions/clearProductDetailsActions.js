import { CLEAR_PRODUCT_DETAILS } from '../constants/productConstants'

export const clearProductDetails = () => async (dispatch) => {
  dispatch({ type: CLEAR_PRODUCT_DETAILS })
}
