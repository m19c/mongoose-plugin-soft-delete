var should = require('should');
var Type = require('mongoose').Schema.Types;
var Mock = require('./mock');
var plugin = require('../');

function noop() {}

describe('mongoose-plugin-soft-delete', function testSutie() {
  var model;

  beforeEach(function handleBeforeEach() {
    model = new Mock();
  });

  afterEach(function handleAfterEach() {
    model = null;
  });

  it('throws an error if the "isDeleted" option is disabled', function isDeletedDisabled() {
    (function shouldThrow() {
      plugin(model, {
        declaration: {
          isDeleted: false
        }
      });
    }).should.throw();
  });

  it('skip disabled declarations', function skipUnknownTest() {
    plugin(model, {
      declaration: {
        deleted: false
      }
    });

    model.added.should.have.length(2);
  });

  it(
    'attach the restore-function if the proper option has been enabled',
    function enabledRestoreTest() {
      plugin(model, { restorable: true });
      model.methods.should.have.property('restore');
    }
  );

  it(
    'has no restore-function if the proper option has been disabled',
    function disabledRestoreTest() {
      plugin(model, { restorable: false });
      model.methods.should.not.have.property('restore');
    }
  );

  it('adds the defined "isDeleted" schema declaration', function isDeletedDeclarationTest() {
    plugin(model, {
      declaration: {
        isDeleted: {
          key: 'isNotActive',
          config: {
            index: true
          }
        }
      }
    });

    model.added.should.containEql({
      isNotActive: {
        type: Boolean,
        required: true,
        default: false,
        index: true
      }
    });
  });

  it('adds the defined "deletedBy" schema declaration', function deletedByDeclarationTest() {
    plugin(model, {
      declaration: {
        deletedBy: {
          key: 'deletedByUser',
          config: {
            index: true,
            ref: 'Member'
          }
        }
      }
    });

    model.added.should.containEql({
      deletedByUser: {
        type: Type.ObjectId,
        ref: 'Member',
        default: null,
        index: true
      }
    });
  });

  it('adds the defined "deleted" schema declaration', function deletedDeclarationTest() {
    plugin(model, {
      declaration: {
        deleted: {
          key: 'deletedAt',
          config: {
            index: true
          }
        }
      }
    });

    model.added.should.containEql({
      deletedAt: {
        type: Date,
        default: null,
        index: true
      }
    });
  });

  describe('#delete', function deleteSuite() {
    it(
      'expects a function as the first argument if the "deletedBy" declaration is disabled',
      function disabledDeletedByTest() {
        plugin(model, {
          declaration: {
            deletedBy: false
          }
        });

        (function shouldThrow() {
          model.methods.delete(1, noop);
        }).should.throw();
      }
    );

    it(
      'throws an error if one of the first two arguments are not a function',
      function expectCallbackTest() {
        plugin(model);

        (function shouldThrow() { model.methods.delete(1); }).should.throw();
        (function shouldThrow() { model.methods.delete(); }).should.throw();
      }
    );

    it('updates the data', function updateDataTest(done) {
      var entity = {
        isDeleted: false,
        deleted: null,
        deletedBy: null,
        save: function handleSave(callback) {
          callback();
        }
      };

      plugin(model);

      model.methods.delete.apply(entity, [1, function handleDelete() {
        entity.isDeleted.should.be.true();
        entity.deleted.should.be.a.Number();
        entity.deletedBy.should.equal(1);
        done();
      }]);
    });
  });

  describe('#restore', function restoreSuite() {
    it('throws an error if the passed argument is not a function', function noCallbackTest() {
      plugin(model);
      (function shouldThrow() { model.methods.restore(); }).should.throw();
    });

    it('updates the data', function updateTest(done) {
      var entity = {
        isDeleted: true,
        deleted: Date.now(),
        deletedBy: 1,
        save: function handleSave(callback) {
          callback();
        }
      };

      plugin(model);

      model.methods.restore.call(entity, function handleRestore() {
        entity.isDeleted.should.be.false();
        should(entity.deleted).not.be.ok();
        should(entity.deletedBy).not.be.ok();
        done();
      });
    });
  });
});
