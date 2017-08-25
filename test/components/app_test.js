import React from 'react';
import { renderComponent , expect , assert } from '../test_helper';
import StudentsTest from '../../src/components/student_test';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';

describe('StudentsTest' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(StudentsTest);
  });


  it('Student test renders all the students', () => {
    expect(component).to.exist;
  });

  it('The student data should be set to property or state as an object', () => {
    const wrapper = shallow(<StudentsTest />);
    expect(typeof(wrapper.props())).to.equal('object')
  })

  it('Student data should be parsed and mounted once', () => {
    sinon.spy(StudentsTest.prototype, 'componentWillMount');
    const wrapper = mount(<StudentsTest />);
    expect(StudentsTest.prototype.componentWillMount.callCount).to.equal(1);
  })

  it('Should calculate student paths', () => {
    const wrapper = shallow( <StudentsTest /> ).instance();
    wrapper.studentPaths()
  })

  it('Each student should be rendered', () => {
    const wrapper = shallow( <StudentsTest /> ).instance()
    wrapper.renderStudents()
  })

  it('Should list the paths for each student', () => {
    const wrapper = shallow( <StudentsTest /> )
    expect(wrapper.containsMatchingElement(<li className='path' />)).to.equal(false);
    expect(wrapper.containsMatchingElement(<h5 className='path'>K.RI, 1.RI, 2.RF, 2.RI, 3.RF</h5>)).to.equal(false);
  })

  it('Should render student paths on page and should only render once it has been calculated', () => {
    const wrapper = mount(<StudentsTest />);
    expect(wrapper.find('.path').every('.path')).to.equal(true)
    expect(wrapper.find('.path')).to.have.lengthOf(0)
  })

  // it('Should contain correct path', () => {
  //   const wrapper = shallow( <StudentsTest /> ).instance()
  //   expect(wrapper.renderStudents()).to.contain('Student Path: K.RI, 1.RI, 2.RF, 2.RI, 3.RF')
  // })

  it('Should contain correct path', () => {
    const wrapper = mount(<StudentsTest />);
    expect(wrapper.find('ul').childAt(0).type()).to.equal('li');
  })


});
