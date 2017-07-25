import chai from 'chai';
import immutable from 'seamless-immutable';
import * as selectors from './selectors';

chai.should();

describe('selectors', () => {
  describe('getRepository', () => {
    const state = immutable({
      repository: {
        test: {
          value: 123,
        },
      },
    });
    it('should return a function', () => {
      selectors.getRepository('test').should.be.a('function');
    });

    it('should return the repository from the state (curried version)', () => {
      selectors.getRepository('test')(state).should.equal(123);
    });

    it('should have method \'fromState\'', () => {
      selectors.getRepository('test').fromState.should.be.a('function');
    });

    it('should return the repository from the state (chained version)', () => {
      selectors.getRepository('test').fromState(state).should.equal(123);
    });
  });
  describe('getPromise', () => {
    const state = immutable({
      repository: {
        test: {
          fulfilled: true,
          pending: false,
          value: 123,
        },
      },
    });
    it('should return a function', () => {
      selectors.getPromise('test').should.be.a('function');
    });

    it('should return the PromiseState from the state (curried version)', () => {
      selectors.getPromise('test')(state).should.be.an('object');
      selectors.getPromise('test')(state).should.equal(state.repository.test);
    });

    it('should have method \'fromState\'', () => {
      selectors.getPromise('test').fromState.should.be.a('function');
    });

    it('should return the PromiseState from the state (chained version)', () => {
      selectors.getPromise('test').fromState(state).should.be.an('object');
      selectors.getPromise('test').fromState(state).should.equal(state.repository.test);
    });
  });
});
