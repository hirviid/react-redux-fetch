import chai from 'chai';
import Definition from './Definition';

chai.should();

describe('Definition', () => {
  describe('constructor()', () => {
    it('should store the passed arguments', () => {
      const args = {
        foo: {
          bar: 'foobar',
        },
      };
      const def = new Definition(args);

      def.args.should.equal(args);
    });

    it('should initialze "args" with an empty object if no arguments are passed', () => {
      const def = new Definition();
      def.args.should.eql({});
    });
  });

  describe('replaceArgument()', () => {
    const args = {
      foo: {
        bar: 'foobar',
      },
    };
    const def = new Definition(args);

    it('should return the definition instance', () => {
      def.replaceArgument('foo.bar', 'barfoo').should.equal(def);
    });

    it('should replace an argument at a given path', () => {
      def.args.foo.bar.should.equal('barfoo');
    });

    it('should add the path if the path does not exist', () => {
      def.replaceArgument('john.doe', 'jane').args.should.have.property('john');
      def.args.john.doe.should.equal('jane');
    });
  });

  describe('addArgument()', () => {
    const def = new Definition();

    it('should return the definition instance', () => {
      def.addArgument('john', { doe: 'jane' }).should.equal(def);
    });

    it('should add an argument at a given key', () => {
      def.args.should.eql({ john: { doe: 'jane' } });
    });
  });

  describe('getArguments()', () => {
    it('should return the args object', () => {
      const args = {
        foo: {
          bar: 'foobar',
        },
      };
      const def = new Definition(args);
      def.getArguments().should.equal(args);
    });
  });

  describe('getArgument()', () => {
    it('should return the arg for the key', () => {
      const args = {
        foo: {
          bar: 'foobar',
        },
      };
      const def = new Definition(args);
      def.getArgument('foo').should.equal(args.foo);
    });

    it('should throw an error if the key does not exist', () => {
      const def = new Definition();
      (function shouldThrow() {
        def.getArgument('foo');
      }).should.throw(Error);
    });
  });
});
