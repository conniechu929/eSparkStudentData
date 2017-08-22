import _ from 'lodash';
import { STUDENT_TESTS } from '../actions/index';

export default function(state=[], action) {
  switch(action.type) {
    case STUDENT_TESTS:
      console.log("INSIDE STUDENT REDUCER: ", action.payload.data);
      return [action.payload.data, ...state ];
  }
  return state;
}
