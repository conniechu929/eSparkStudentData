import _ from 'lodash';
import React, { Component } from 'react';
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

class StudentsTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.change = false;
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

  convertInteger(str){
    if(str === "K") {
      return 0
    }
    else{
      return Number(str)
    }
  }

  convertLevel(domain, level, path){
      if(domain.priority === 0) {
        path.push("K."+ domain.value)
      }
      else{
        path.push(domain.priority +"."+ domain.value)
      }
  }

  addStudentPaths(student, domain, path, count) {
    while(count < 5 && domain) {
      var convertedLevel = this.convertInteger(student[domain.value])
      if(domain.priority >= convertedLevel) {
        this.convertLevel(domain, convertedLevel, path)
        count++;
      }
      domain = domain.next;
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
          if(student[current_domain.value] === current_level || student[current_domain.value]  === " " || (current_domain.value === "L" && current_level === '2' && current_domain.priority > this.convertInteger(student[current_domain.value])) ) {
            var count = 1;
            var path = [current_level +"."+ current_domain.value]
            current_domain = current_domain.next;
            this.addStudentPaths(student, current_domain, path, count);
            student.path = path.join(', ')
            new_data[student['Student Name']] = student;
            return student
          }
          current_domain = current_domain.next;
        }
      })
      if(new_data != this.state.data){
        this.setState({data: new_data});
      }
    });
  }

  renderStudents() {
    if(this.change === false) {
      this.studentPaths()
      this.change = true;
    }
    return _.map(this.state.data, d => {
      if (d["Student Name"] != null) {
        return (
          <li className="list-group-item" key={d.id}>
            <h3>{d["Student Name"]}</h3>
            <p>Reading Foundations (RF): {d["RF"]}</p>
            <p>Reading Literature (RL): {d["RL"]}</p>
            <p>Reading Informational Text(RI): {d["RI"]}</p>
            <p>Literature (L): {d["L"]}</p>
            <h5 className="path">Student Path: {d["path"]} </h5>
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
        <br></br>
        <h2>Student Paths</h2>
        <ul className="list-group">
          {this.renderStudents()}
        </ul>
      </div>
    );
  }
}

export default StudentsTest;
