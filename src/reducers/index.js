import { combineReducers } from 'redux';
import StudentsReducer from './student_reducer';

const rootReducer = combineReducers({
  students: StudentsReducer
});

export default rootReducer;
