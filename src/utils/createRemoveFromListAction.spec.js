import chai from 'chai';
import immutable from 'seamless-immutable';
import { FETCH } from '../constants/actionTypes';
import createRemoveFromListAction from './createRemoveFromListAction';

chai.should();

describe('createRemoveFromListAction()', () => {
  const state = immutable({
    pending: true,
    fulfilled: false,
    value: [
        { id: 1, text: 'old text' },
        { id: 2, text: 'old text' },
        { id: 3, text: 'old text' },
    ],
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
        removeFromList: {
          idName: 'id',
        },
      },
    },
  };

  it('should remove the item', () => {
    const newAction = createRemoveFromListAction(state, action);

    newAction.value.should.eql([
        { id: 1, text: 'old text' },
        { id: 3, text: 'old text' },
    ]);
  });
});
