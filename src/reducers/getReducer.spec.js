import chai from 'chai';
import immutable from 'seamless-immutable';
import { FETCH } from '../constants/actionTypes';
import getReducer from './getReducer';

chai.should();

describe('getReducer', () => {
  describe('@@INIT', () => {
    const newState = getReducer(undefined, {});

    it('should set pending to false', () => {
      newState.pending.should.equal(false);
    });

    it('should set pending to false', () => {
      newState.fulfilled.should.equal(false);
    });

    it('should set rejected to false', () => {
      newState.rejected.should.equal(false);
    });
  });

  describe('react-redux-fetch/GET_REQUEST', () => {
    const state = immutable({
      toGet: {
        pending: true,
        fulfilled: false,
        value: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    const action = {
      type: FETCH.for('get').REQUEST,
      key: 'toGet',
      request: { meta: {} },
    };
    const newState = getReducer(state.toGet, action);

    it('should set pending to true', () => {
      newState.pending.should.equal(true);
    });

    it('should set pending to false', () => {
      newState.fulfilled.should.equal(false);
    });

    it('should set rejected to false', () => {
      newState.rejected.should.equal(false);
    });
  });

  describe('react-redux-fetch/GET_FULFIL', () => {
    const simpleState = immutable({
      myValue: {
        pending: true,
        fulfilled: false,
        rejected: false,
      },
    });
    const simpleAction = {
      type: FETCH.for('get').FULFILL,
      key: 'myValue',
      value: {
        id: 2,
        text: 'new text',
      },
      request: { meta: null },
    };

    it('should store the new value', () => {
      getReducer(simpleState.myValue, simpleAction).should.eql({
        pending: false,
        fulfilled: true,
        rejected: false,
        meta: null,
        value: {
          id: 2,
          text: 'new text',
        },
      });
    });

    describe('with "addToList" meta', () => {
      const state = immutable({
        myList: {
          pending: true,
          fulfilled: false,
          value: [
            { id: 1, text: 'old text' },
            { id: 2, text: 'old text' },
            { id: 3, text: 'old text' },
          ],
        },
      });

      const action = {
        type: FETCH.for('get').FULFILL,
        key: 'myList',
        value: {
          id: 2,
          text: 'new text',
        },
        request: {
          meta: {
            addToList: {
              idName: 'id',
              id: 2,
            },
          },
        },
      };
      const newState = getReducer(state.myList, action);

      it('should replace the item in the list', () => {
        newState.value.should.eql([{ id: 1, text: 'old text' }, { id: 2, text: 'new text' }, { id: 3, text: 'old text' }]);
      });

      it('should set fulfilled to true', () => {
        newState.fulfilled.should.equal(true);
      });

      it('should set pending to false', () => {
        newState.pending.should.equal(false);
      });

      it('should set rejected to false', () => {
        newState.rejected.should.equal(false);
      });
    });

    describe('with complex "addToList" meta', () => {
      const state = immutable({
        myList: {
          pending: true,
          fulfilled: false,
          value: {
            very: {
              deep: [
                { id: 1, text: 'old text' },
                { id: 2, text: 'old text' },
                { id: 3, text: 'old text' },
              ],
            },
          },
        },
      });

      const action = {
        type: FETCH.for('get').FULFILL,
        key: 'myList',
        value: {
          very: {
            deep: [
              { id: 2, text: 'new text' },
              { id: 4, text: 'new text' },
            ],
          },
        },
        request: {
          meta: {
            addToList: {
              path: 'very.deep',
              idName: 'id',
            },
          },
        },
      };

      const newState = getReducer(state.myList, action);

      it('should replace the item in the list', () => {
        newState.value.should.eql({
          very: {
            deep: [
              { id: 1, text: 'old text' },
              { id: 2, text: 'new text' },
              { id: 3, text: 'old text' },
              { id: 4, text: 'new text' },
            ],
          },
        });
      });

      it('should set fulfilled to true', () => {
        newState.fulfilled.should.equal(true);
      });

      it('should set pending to false', () => {
        newState.pending.should.equal(false);
      });

      it('should set rejected to false', () => {
        newState.rejected.should.equal(false);
      });
    });
  });
});
