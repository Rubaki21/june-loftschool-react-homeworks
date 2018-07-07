import { call, put, select } from 'redux-saga/effects'
import {
  getIsNetworkErrorPresent,
  clearNetworkErrors,
  networkError
} from 'ducks/network'
import { logout } from 'ducks/auth'

export default function*(fn, ...args) {
  try {
    const response = yield call(fn, ...args)
    if (yield select(getIsNetworkErrorPresent)) yield put(clearNetworkErrors())
    return response
  } catch (error) {
    const message = error.response.data.message
    yield put(networkError(message || error.toString()))
    if (error.response.status === 401) yield put(logout())

    throw error
  }
}
