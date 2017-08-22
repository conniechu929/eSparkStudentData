import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parsedStudentData } from '../actions';
import { csv } from 'd3-request';
import * as d3 from "d3";
import { csvParseRows } from 'd3-dsv';

class Node {
    constructor(val, priority) {
      this.value = val;
      this.priority = priority;
      this.next = null;
    }
}

class PriorityQueue {
    constructor(prop) {
      this.first = null;
    }

    insert(value, priority) {
      const newNode = new Node(value, priority);
      if (!this.first || priority > this.first.priority) {
        newNode.next = this.first;
        this.first = newNode;
      } else {
        let pointer = this.first;
        while (pointer.next && priority < pointer.next.priority) {
          pointer = pointer.next;
        }
        newNode.next = pointer.next;
        pointer.next = newNode;
      }
    }

    parseDomain() {
      const obj = {}
        d3.text('./src/data/domain_order1.csv', function(text) {
          d3.csvParseRows(text).map(function(row) {
              return row.map(function(value) {
                return obj[row[0]] = Array.from(row.slice(1));
              })
          });
        })
        return obj
    }

}

// const test_domains = PriorityQueue.parseDomain;
// console.log("DOMAIN OBJECT IN QUEUE: ", test_domains);
console.log("IN THE QUEUE")

class StudentsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    csv('./src/data/student_tests1.csv', (error, data) => {
       if (error) {
         this.setState({loadError: true});
       }
      this.setState({
        data: _.mapKeys(data, 'Student Name')
        // data: _.mapValues(data, "Student Name")
      })
    })

    this.parseDomain();
    console.log("THIS IS THE DOMAIN OBJ: ", this.parseDomain())
    // this.studentPaths();
  }

  parseDomain() {
    const obj = {}
      d3.text('./src/data/domain_order1.csv', function(text) {
        d3.csvParseRows(text).map(function(row) {
            return row.map(function(value) {
              return obj[row[0]] = Array.from(row.slice(1));
            })
        });
      })
      return obj
  }



  studentPaths() {
    const grade_domain = this.parseDomain();
    // var domain_array = []
    // Object.keys(grade_domain).forEach(function(key) {
    //   grade
    // });
    // console.log('DOMAIN_ARRAY:', domain_array);
    // console.log('THIS IS THE GRADE DOMAIN OBJ: ', grade_domain)
    console.log("STATE IN STUDENT PATHS: ", this.state.data)
    const studentData = this.state.data;
    _.map(studentData, student => {
        console.log(student)
            var studentKey = Object.keys(student);
            var lowest = _.min(studentKey, function (val) {
              var first_min = 0
              if(student[val] === "K" || student[val] === 'k'){
                console.log("IN IF CHECK")
                return first_min
              }
              else if(student[val] === '' || student[val] === null){
                return -1
              }
              else {
                first_min = parseInt(student[val]);
                console.log("FIRST MIN: ", first_min)
                return first_min
              }
          });
          console.log("LOWEST GRADE: ", student[lowest])
          console.log("LOWEST DOMAIN: ", lowest)
          return lowest;
    })
    // find the min of the grades from studentTest
    // while loop --> while count is less than 5
      // loop from the lowest test in domain_order
      // compare the key(which is the grade) to the grade associated to the test of the student
      // if grade of student is less than the grade at the domain, add test to Array
      // return 5 total tests
    var count = 0;
    while (count < 5) {

      count++
    }
  }

  renderStudents() {
    return _.map(this.state.data, d => {
      if (d["Student Name"] != null) {
        return (
          <li className="list-group-item" key={d.id}>
            <p>{d["Student Name"]}</p>
            <p>Reading Foundations: {d["RF"]}</p>
            <p>Reading Literature: {d["RL"]}</p>
            <p>Reading Informational Text: {d["RI"]}</p>
            <p>Level: {d["L"]}</p>
          </li>
          )
        }
      })
  };

  render() {
    if (this.state.loadError) {
      return <div>couldn't load file</div>;
    }
    if (!this.state.data) {
      return <div />;
    }
    return (
      <div>
        <h3>Student Paths</h3>
        <ul className="list-group">
          {this.renderStudents()}
          {this.studentPaths()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { students: state.students };
}

export default connect(mapStateToProps, { parsedStudentData })(StudentsIndex);
