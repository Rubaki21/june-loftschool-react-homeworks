import { takeEvery, put, call } from 'redux-saga/effects';
import { requestFlow } from './request';
import { authorize } from 'ducks/auth';

import {
  fetchTokenOwnerRequest,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure
} from '../ducks/users';

import { getTokenOwner, getUserInformation } from '../api';

function* getUserInfoWorker(action) {
  try {
    const result = yield requestFlow(getUserInformation, action.payload);
    yield put(fetchUserSuccess(result.data));
  } catch (error) {
    yield put(fetchUserFailure(error));
  }
}

function* tokenOwnerWorker() {
  try {
    yield put(fetchTokenOwnerRequest());
    const result = yield call(requestFlow, getTokenOwner);
    yield put(fetchUserSuccess(result.data));
  } catch (error) {
    yield put(fetchUserFailure(error));
  }
}

export function* fetchUserWatch() {
  yield takeEvery(authorize, tokenOwnerWorker);
  yield takeEvery(fetchUserRequest, getUserInfoWorker);
}
