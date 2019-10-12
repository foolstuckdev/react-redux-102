 import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts()); // manual dispatch - this will be picked by redux-thunk and get invoked by passing dispatch as firt argument, do all work and update the reducer
  // await makes the case fetchPosts should be completed since only then it makes sense to move ahead

  //const userIds = _.uniq(_.map(getState().posts, 'userId'));
  //userIds.forEach( id => dispatch(fetchUser(id)));

  _.chain(getState().posts)
   .map('userId')
   .uniq()
   .forEach(id => dispatch(fetchUser(id)))
   .value()
};



export const fetchPosts = () => async dispatch => {
  const response = await jsonPlaceholder.get("/posts");

  dispatch({
    type: "FETCH_POSTS",
    payload: response.data
  });
};

export const fetchUser = id => async dispatch => {
  const response = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};

// using memoize from lodash to limit repetitive calls for same user id
// this approach however assumes user ids would never change and would fail in case of a change
// export const fetchUser = (id) => dispatch => _fetchUser(id, dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//     const response = await jsonPlaceholder.get(`/users/${id}`);
//     dispatch({type: 'FETCH_USER', payload: response.data});
// })
