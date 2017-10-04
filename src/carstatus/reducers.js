const defaultState = {
  status: null,
  error: null
}

export default function fetchStatus(state = defaultState, action) {
  switch(action.type) {
    case 'DUSTIN_CAR_STATUS_GET_SUCCEEDED':
      return {...state, status: action.status}
    case 'DUSTIN_CAR_STATUS_GET_FAILED':
      console.error(action.message)
      return {...state, error: action.message}
    default:
      return defaultState;
  }
}
