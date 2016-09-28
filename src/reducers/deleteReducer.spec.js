import chai from 'chai';
import immutable from 'seamless-immutable';
import { FETCH } from '../constants/actionTypes';
import deleteReducer from './deleteReducer';

chai.should();

describe('deleteReducer', () => {
  describe('@@INIT', () => {
    const newState = deleteReducer(undefined, {});

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

  describe('react-redux-fetch/DELETE_REQUEST', () => {
    const state = immutable({
      toDelete: {
        pending: true,
        fulfilled: false,
        value: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    const action = {
      type: FETCH.for('delete').REQUEST,
      key: 'toDelete',
      request: {
        meta: {},
      },
    };
    const newState = deleteReducer(state.toDelete, action);

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

  describe('react-redux-fetch/DELETE_FULFIL', () => {
    const state = immutable({
      myList: {
        pending: true,
        fulfilled: false,
        value: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    const action = {
      type: FETCH.for('delete').FULFILL,
      key: 'myList',
      request: {
        meta: {
          removeFromList: {
            idName: 'id',
            id: 2,
          },
        },
      },
    };
    const newState = deleteReducer(state.myList, action);

    it('should remove the item from the list', () => {
      newState.value.should.eql([{ id: 1 }, { id: 3 }]);
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

    const stateWithoutValue = immutable({
      myList: {
        pending: false,
        fulfilled: true,
      },
    });

    const actionWithValue = {
      type: FETCH.for('delete').FULFILL,
      key: 'myList',
      value: {
        id: 2,
      },
      request: {
        meta: {
          removeFromList: {
            idName: 'id',
            id: 2,
          },
        },
      },
    };
    const newState2 = deleteReducer(stateWithoutValue.myList, actionWithValue);

    it('should set the state value to the action value if the state has no value', () => {
      newState2.value.should.eql({ id: 2 });
    });
  });
});
