import { call, put } from 'redux-saga/effects'
import Api from '../api'

export function* fetchStatus(action) {
  try {
    const data = yield call(Api.car_status, action.lastid)
    yield put({type: 'DUSTIN_CAR_STATUS_GET_SUCCEEDED', status: data})
  } catch (e) {
    yield put({type: 'DUSTIN_CAR_STATUS_GET_FAILED', message: e.message})
  }
}
