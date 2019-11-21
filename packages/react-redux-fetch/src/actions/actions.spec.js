import chai from 'chai';
import actions, { action } from './actions';

chai.should();

describe('actions', () => {
  describe('action()', () => {
    const actionCreator = action('ACTION_TYPE');
    const payload = { john: 'doe' };

    it('should return a function', () => {
      actionCreator.should.be.a('function');
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
        actionCreators.should.be.an('object');
      });

      it('should have properties request, fulfil and reject, which are functions', () => {
        actionCreators.should.have.keys(['request', 'fulfill', 'reject']);
        actionCreators.request.should.be.a('function');
        actionCreators.fulfill.should.be.a('function');
        actionCreators.reject.should.be.a('function');
      });

      describe('request()', () => {
        const requestAction = actionCreators.request({
          resource: { name: 'a' },
          request: {
            url: 'www.react-redux-fetch.com',
          },
        });

        it('should have properties: type, resource, request', () => {
          requestAction.should.be.an('object');
          requestAction.should.have.keys(['type', 'resource', 'request']);
          requestAction.resource.should.eql({ name: 'a' });
          requestAction.request.should.eql({ url: 'www.react-redux-fetch.com' });
        });
      });

      describe('fulfill()', () => {
        const fulfillAction = actionCreators.fulfill({
          resource: { name: 'a' },
          value: 'b',
          request: {
            meta: { john: 'doe' },
          },
        });

        it('should have properties: type, resource, value, request', () => {
          fulfillAction.should.be.an('object');
          fulfillAction.should.have.keys(['type', 'resource', 'value', 'request']);
          fulfillAction.resource.should.eql({ name: 'a' });
          fulfillAction.value.should.equal('b');
          fulfillAction.request.should.eql({ meta: { john: 'doe' } });
        });
      });

      describe('reject()', () => {
        const rejectAction = actionCreators.reject({
          resource: { name: 'a' },
          reason: 'b',
          request: {
            meta: { john: 'doe' },
          },
        });

        it('should have properties: type, resource, reason, request', () => {
          rejectAction.should.be.an('object');
          rejectAction.should.have.keys(['type', 'resource', 'reason', 'request']);
          rejectAction.resource.should.eql({ name: 'a' });
          rejectAction.reason.should.equal('b');
          rejectAction.request.should.eql({ meta: { john: 'doe' } });
        });
      });
    });
  });
});
