import Registry from './Registry';
import fetchRequest from '../middleware/fetchRequest';
import getReducer from '../reducers/getReducer';
import deleteReducer from '../reducers/deleteReducer';
import postReducer from '../reducers/postReducer';
import putReducer from '../reducers/putReducer';

const registry = new Registry();


/*
 * Register standard request methods
 */
registry.registerRequestMethod('get', {
    actionPrefix: 'fetch',
    middleware: fetchRequest,
    reducer: getReducer
});

registry.registerRequestMethod('delete', {
    actionPrefix: 'remove',
    middleware: fetchRequest,
    reducer: deleteReducer
});

registry.registerRequestMethod('post', {
    actionPrefix: 'create',
    middleware: fetchRequest,
    reducer: postReducer
});

registry.registerRequestMethod('put', {
    actionPrefix: 'update',
    middleware: fetchRequest,
    reducer: putReducer
});


export default registry;
