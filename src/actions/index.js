import _ from 'lodash';
import { csv } from 'd3-request';

export const STUDENT_TESTS = 'STUDENT_TESTS';

console.log("INSIDE ACTIONS")

export function parsedStudentData() {

  return {
    type: STUDENT_TESTS
    // payload: request
  }
}
