import chai from 'chai';
import ContainerBuilder from './ContainerBuilder';
import Definition from './Definition';

chai.should();

describe('Definition', () => {
  describe('register()', () => {
    it('should return an instance of Definition', () => {
      const container = new ContainerBuilder();
      container.register('FooBar', { foo: { bar: 'foobar' } }).should.be.an.instanceOf(Definition);
    });
  });

  describe('setDefinition()', () => {
    const container = new ContainerBuilder();
    const def = container.setDefinition('FooBar', new Definition({ foo: { bar: 'foobar' } }));

    it('should return an instance of Definition', () => {
      def.should.be.an.instanceOf(Definition);
    });

    it('should add the passed definition to its definitions list', () => {
      container.definitions.should.eql({ foobar: def });
    });
  });

  describe('getDefinition()', () => {
    const container = new ContainerBuilder();
    const def = container.setDefinition('FooBar', new Definition({ foo: { bar: 'foobar' } }));

    it('should return the correct definition for given id', () => {
      container.getDefinition('FooBar').should.equal(def);
    });

    it('should handle given id case-insensitive', () => {
      container.getDefinition('FoObAr').should.equal(def);
    });

    it('should throw an error if id does not exist', () => {
      (function shouldThrow() {
        container.getDefinition('john');
      }).should.throw(Error);
    });
  });

  describe('hasDefinition', () => {
    const container = new ContainerBuilder();
    container.register('FooBar', { foo: 'bar' });

    it('should return true if container has definition', () => {
      container.hasDefinition('FooBar').should.equal(true);
    });

    it('should return false if container does not have definition', () => {
      container.hasDefinition('BarFoo').should.equal(false);
    });
  });
});
