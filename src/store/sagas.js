import { takeEvery } from 'redux-saga/effects'
import { fork } from 'redux-saga/effects'

import {fetchStatus} from '../carstatus/sagas'

function* sagas() {
  yield fork(takeEvery, 'DUSTIN_CAR_STATUS', fetchStatus)
}

export default sagas
