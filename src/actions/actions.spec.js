import chai from 'chai';
import actions, {action} from './actions';

chai.should();

describe('actions', () => {

    describe('action()', () => {

        const actionCreator = action('ACTION_TYPE');
        const payload = {john:'doe'};

        it('should return a function', () => {
            actionCreator.should.be.a.function;
        });

        it('should return an object with a type property, when executing the actionCreator function', () => {
            actionCreator().should.have.a.property('type');
            actionCreator().type.should.equal('ACTION_TYPE');
        });

        it('should return an object with the passed payload, when executing the actionCreator function', () => {
            actionCreator(payload).should.have.property('john').and.equal('doe');
        });

    });

    describe('actions', () => {

        describe('for()', () => {

            const verb = 'post';
            const actionCreators = actions.for(verb);

            it('should return an object', () => {
                actionCreators.should.be.an.object;
            });

            it('should have properties request, fulfil and reject, which are functions', () => {
                actionCreators.should.have.keys(['request', 'fulfill', 'reject']);
                actionCreators.request.should.be.a.function;
                actionCreators.fulfill.should.be.a.function;
                actionCreators.reject.should.be.a.function;
            });

            describe('request()', () => {

                const requestAction = actionCreators.request('a','b','c');

                it('should have properties: type, key, url, request', () => {

                    requestAction.should.be.an.object;
                    requestAction.should.have.keys(['type', 'key', 'url', 'request']);
                    requestAction.key.should.equal('a');
                    requestAction.url.should.equal('b');
                    requestAction.request.should.equal('c');
                });

            });

            describe('fulfill()', () => {

                const fulfillAction = actionCreators.fulfill('a','b','c');

                it('should have properties: type, key, value, meta', () => {

                    fulfillAction.should.be.an.object;
                    fulfillAction.should.have.keys(['type', 'key', 'value', 'meta']);
                    fulfillAction.key.should.equal('a');
                    fulfillAction.value.should.equal('b');
                    fulfillAction.meta.should.equal('c');
                });

            });

            describe('reject()', () => {

                const rejectAction = actionCreators.reject('a','b','c');

                it('should have properties: type, key, url, request', () => {

                    rejectAction.should.be.an.object;
                    rejectAction.should.have.keys(['type', 'key', 'url', 'request']);
                    rejectAction.key.should.equal('a');
                    rejectAction.url.should.equal('b');
                    rejectAction.request.should.equal('c');
                });

            });

        });

    });

});
