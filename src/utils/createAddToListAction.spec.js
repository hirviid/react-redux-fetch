import chai from 'chai';
import immutable from 'seamless-immutable';
import { FETCH } from '../constants/actionTypes';
import createAddToListAction from './createAddToListAction';

chai.should();

describe('createAddToListAction()', () => {
  const state = immutable({
    pending: true,
    fulfilled: false,
    value: [
        { id: 1, text: 'old text' },
        { id: 2, text: 'old text' },
        { id: 3, text: 'old text' },
    ],
  });

  describe('existing item', () => {
    const actionUpdate = {
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

    it('should replace the existing item', () => {
      const action = createAddToListAction(state, actionUpdate);

      action.value.should.eql([
        { id: 1, text: 'old text' },
        { id: 2, text: 'new text' },
        { id: 3, text: 'old text' },
      ]);
    });
  });

  describe('new item', () => {
    const actionNew = {
      type: FETCH.for('get').FULFILL,
      key: 'myList',
      value: {
        id: 4,
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

    it('should add the new item', () => {
      const action = createAddToListAction(state, actionNew);

      action.value.should.eql([
        { id: 1, text: 'old text' },
        { id: 2, text: 'old text' },
        { id: 3, text: 'old text' },
        { id: 4, text: 'new text' },
      ]);
    });
  });
});
