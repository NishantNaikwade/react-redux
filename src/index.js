import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider, useSelector, useDispatch } from 'react-redux';
import './style.css';

const countReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INC':
      return { count: state.count + 1 };
    default:
      return state;
  }
};

const fetchUsers = async (dispatch) => {
  try {
    console.log('fetching users');
    dispatch({
      type: 'FETCH_USERS_LOADING',
      payload: true,
    });
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts'
    ).then((res) => res.json());
    console.log('response : ', response);
    dispatch({
      type: 'FETCH_USERS',
      payload: response,
    });
    dispatch({
      type: 'FETCH_USERS_LOADING',
      payload: false,
    });
  } catch (err) {
    console.log('error in fetch posts', err);
    dispatch({
      type: 'FETCH_USERS_ERROR',
      payload: err,
    });
    dispatch({
      type: 'FETCH_USERS_LOADING',
      payload: false,
    });
  }

  // .then((res) => {
  //   console.log('res', res);
  //   return res.json();
  // })
  // .then((data) => setData(data))
  // .catch((err) => console.log(err));
};

const userReducer = (
  state = { users: [], error: false, isLoading: false },
  action
) => {
  switch (action.type) {
    case 'FETCH_USERS':
      return { ...state, users: [...action.payload] };
    case 'FETCH_USERS_ERROR':
      return {
        ...state,
        error: true,
      };
    case 'FETCH_USERS_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const reducers = combineReducers({
  counter: countReducer,
  user: userReducer,
});

const store = createStore(reducers);

function App() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user.users);
  const isLoading = useSelector((state) => state.user.isLoading);
  const counter = useSelector((state) => state.counter.count);
  const error = useSelector((state) => state.user.error);
  return (
    <div>
      <button
        onClick={() =>
          dispatch({
            type: 'INC',
          })
        }
      >
        Increment
      </button>

      <div>Value: {counter}</div>
      <button onClick={() => fetchUsers(dispatch)}>Fetch POSTs</button>
      {isLoading && <label>Loading </label>}
      {error && <label>Error Occurred!!! </label>}
      <div>Posts: {data.length}</div>
    </div>
  );
}

const AppContainer = connect()(App);

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
