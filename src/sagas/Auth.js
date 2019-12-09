import { all, call, fork, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
    SIGNIN_USER,
    SIGNOUT_USER,
    SIGNUP_USER
} from "constants/ActionTypes";
import { showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess } from "actions/Auth";
import { auth } from 'services/api'


function* createUser({ payload }) {
    const { email, firstName, lastName, shop, password } = payload;
    try {
        const response = yield call(auth.signUp, { email, firstName, lastName, shop, password });
        const { user, token, message } = response.data
        if (message) {
            yield put(showAuthMessage(message));
        } else {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            yield put(userSignUpSuccess(user));
        }
    } catch (error) {
        console.log(error)
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithEmailPassword({ payload }) {
    const { email, password } = payload;
    try {
        const response = yield call(auth.signIn, { email, password });
        const { user, token, message } = response.data
        if (message) {
            yield put(showAuthMessage(message));
        } else {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            yield put(userSignInSuccess(user));
        }
    } catch (error) {
        console.log(error)
        yield put(showAuthMessage(error.response ? error.response.data : 'Có lỗi đã xảy ra'));
    }
}

function* signOut() {
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // const signOutUser = yield call(signOutRequest);
        // if (signOutUser === undefined) {
        yield put(userSignOutSuccess());
        // } else {
        //     yield put(showAuthMessage(signOutUser.message));
        // }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

export function* createUserAccount() {
    yield takeLatest(SIGNUP_USER, createUser);
}

export function* signInUser() {
    yield takeLatest(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
    yield takeLatest(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
    yield all([
        fork(signInUser),
        fork(createUserAccount),
        fork(signOutUser)
    ]);
}