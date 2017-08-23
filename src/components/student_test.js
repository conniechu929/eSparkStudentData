import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { parsedStudentData } from '../actions';
import { csv } from 'd3-request';
import * as d3 from "d3";
import { csvParseRows } from 'd3-dsv';
import update from 'immutability-helper';

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
      if (!this.first || priority < this.first.priority) {
        newNode.next = this.first;
        this.first = newNode;
      } else {
        let pointer = this.first;
        while (pointer.next && priority >= pointer.next.priority) {
          pointer = pointer.next;
        }
        newNode.next = pointer.next;
        pointer.next = newNode;
      }
    }

  showQueue() {
    let current = this.first;
    while(current) {
      if (current.priority === 0) {
        var curr_priority = "K"
        current.priority = curr_priority
      }
      console.log("Level: ", current.value, "TEST: ", current.priority);
      current = current.next;
    }
  }

}

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
      })
    })

  }

  parseDomain() {
      const DomainQueue = new PriorityQueue()
      let promise = new Promise((resolve) => {
        d3.text('./src/data/domain_order1.csv', function(text) {
          d3.csvParseRows(text).map(function(row) {
                if(row[0] === "K"){
                  var curr_priority = 0
                }
                else {
                  var curr_priority = row[0]
                }
                row.slice(1).map(function(value) {
                  return DomainQueue.insert(value, curr_priority)
                })
            })
            resolve(DomainQueue)
          })
      })
      return promise
  }

  convertDomainLevel(domain){
    if(domain.priority === 0) {
      return "K"
    }
    else {
      return domain.priority.toString()
    }
  }

  studentPaths() {
    const studentData = this.state.data;
    let new_data = {}
    const grade_domain = this.parseDomain().then((DomainQueue) => {
      _.map(studentData, student => {
        var current_domain = DomainQueue.first

        while(current_domain) {
          var current_level = this.convertDomainLevel(current_domain)
          if(student[current_domain.value] === current_level || student[current_domain.value]  === " ") {
            // console.log("MINIMUM VALUE. STUDENT NAME: ", student["Student Name"], " Level: ", current_level, " Test: ", current_domain.value)
            var count = 1;
            var path = [current_level +"."+ current_domain.value]
            current_domain = current_domain.next;
            while(count < 5 && current_domain) {
              var current_level = this.convertDomainLevel(current_domain)
              if(current_level !== student[current_domain.value]) {
                path.push(current_level +"."+ current_domain.value)
                count++;
              }
              else {
                current_domain = current_domain.next;
              }
            }
            path = path.join(', ');
            student.path = path

            // console.log("STUDENT NAME FROM STATE: ", this.state.data[student['Student Name']]);
          }
          current_domain = current_domain.next;
        }
        new_data[student['Student Name']] = student;
        // this.setState({...this.state.data, student: student.path });
      })
      if(new_data != this.state.data){
        this.setState({data: new_data});
      }
    });
  }

  renderStudents() {
    this.studentPaths()
    return _.map(this.state.data, d => {
      if (d["Student Name"] != null) {
        return (
          <li className="list-group-item" key={d.id}>
            <p>{d["Student Name"]}</p>
            <p>Reading Foundations: {d["RF"]}</p>
            <p>Reading Literature: {d["RL"]}</p>
            <p>Reading Informational Text: {d["RI"]}</p>
            <p>Level: {d["L"]}</p>
            <p>Path: {d["path"]} </p>
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

        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { students: state.students };
}

export default connect(mapStateToProps, { parsedStudentData })(StudentsIndex);
