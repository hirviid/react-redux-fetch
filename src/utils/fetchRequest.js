import Immutable from 'seamless-immutable';
import {PENDING} from '../constants/request';

const fetchRequest = (state) => {
    if (state.value) {
        return state.merge(PENDING);
    }
    return Immutable(PENDING);
};

export default fetchRequest;
