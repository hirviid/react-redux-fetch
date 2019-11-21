import chai from 'chai';
import { FETCH } from '../constants/actionTypes';
import buildActionsFromMappings from './buildActionsFromMappings';

chai.should();

describe('buildActionsFromMappings', () => {
  describe('basic mapping', () => {
    const basicMapping = [{
      resource: 'basic',
      request: {
        url: 'http://basic.url',
      },
    }];

    const actions = buildActionsFromMappings(basicMapping);

    it('should return an object with 1 function', () => {
      actions.should.be.an('object');
      const actionNames = Object.keys(actions);
      actionNames.should.have.length(1);
      actions[actionNames[0]].should.be.a('function');
    });

    describe('the returned function', () => {
      it('should have the correct name', () => {
        actions.should.have.property('basicGet');
      });

      it('should return an object', () => {
        actions.basicGet().should.be.an('object');
      });

      it('should return a correct redux action', () => {
        actions.basicGet().should.eql({
          type: FETCH.for('get').REQUEST,
          method: 'get',
          request: {
            url: 'http://basic.url',
          },
          resource: {
            name: 'basic',
          },
        });
      });
    });
  });

  describe('2 basic mappings', () => {
    const basicMapping2 = [{
      resource: 'basic',
      request: {
        url: 'http://basic.url',
      },
    }, {
      resource: 'basic2',
      request: {
        url: 'http://basic2.url',
      },
    }];

    const actions = buildActionsFromMappings(basicMapping2);

    it('should return an object with 2 function', () => {
      actions.should.be.an('object');
      const actionNames = Object.keys(actions);
      actionNames.should.have.length(2);
      actions[actionNames[0]].should.be.a('function');
      actions[actionNames[1]].should.be.a('function');
    });
  });

  describe('mapping with resource object', () => {
    const resourceObjectMapping = [{
      resource: {
        name: 'resourceObjectMapping',
        action: 'myRequest',
      },
      request: {
        url: 'http://basic.url',
      },
    }];

    const actions = buildActionsFromMappings(resourceObjectMapping);

    describe('the returned function', () => {
      it('should return a correct redux action', () => {
        actions.myRequestGet().should.eql({
          type: FETCH.for('get').REQUEST,
          method: 'get',
          request: {
            url: 'http://basic.url',
          },
          resource: {
            name: 'resourceObjectMapping',
            action: 'myRequest',
          },
        });
      });
    });
  });

  describe('mapping with request function', () => {
    const requestFnMapping = [{
      resource: 'requestFnMapping',
      request: id => ({
        url: `http://basic.url/${id}`,
      }),
    }];

    const actions = buildActionsFromMappings(requestFnMapping);

    describe('the returned function', () => {
      it('should return a correct redux action', () => {
        actions.requestFnMappingGet(555).should.eql({
          type: FETCH.for('get').REQUEST,
          method: 'get',
          request: {
            url: 'http://basic.url/555',
          },
          resource: {
            name: 'requestFnMapping',
          },
        });
      });
    });
  });
});
