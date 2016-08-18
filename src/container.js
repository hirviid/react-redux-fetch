import ContainerBuilder from './dependencyInjection/ContainerBuilder';
import fetchRequest from './middleware/fetchRequest';
import getReducer from './reducers/getReducer';
import deleteReducer from './reducers/deleteReducer';
import postReducer from './reducers/postReducer';
import putReducer from './reducers/putReducer';
import defaultRequestHeaders from './utils/defaultHeaders';

const container = new ContainerBuilder();

export default container;

export function bootstrap() {

    container.register('requestMethods', {
        'get': {
            actionPrefix: 'fetch',
            middleware: fetchRequest,
            reducer: getReducer
        },
        'post': {
            actionPrefix: 'create',
            middleware: fetchRequest,
            reducer: postReducer
        },
        'put': {
            actionPrefix: 'update',
            middleware: fetchRequest,
            reducer: putReducer
        },
        'delete': {
            actionPrefix: 'remove',
            middleware: fetchRequest,
            reducer: deleteReducer
        }
    });

    container.register('requestHeaders', defaultRequestHeaders);

    // container.getDefinition('requestMethods').replaceArgument('post.middleware', '...');
    // container.getDefinition('requestMethods').addArgument('patch', '...');
    // container.getDefinition('requestMethods').addArgument('token', '...');

    return container;
}

