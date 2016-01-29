var isFunction = require('lodash.isfunction');
var merge = require('lodash.merge');
var Type = require('mongoose').Schema.Types;

module.exports = function softDeletePlugin(schema, options) {
  options = merge({
    restorable: true,
    declaration: {
      isDeleted: {
        key: 'isDeleted',
        config: {
          type: Boolean,
          required: true,
          default: false
        }
      },
      deletedBy: {
        key: 'deletedBy',
        config: {
          type: Type.ObjectId,
          ref: 'User',
          default: null
        }
      },
      deleted: {
        key: 'deleted',
        config: {
          type: Date,
          default: null
        }
      }
    }
  }, options);

  if (!options.declaration.isDeleted) {
    throw new Error('Do not use "mongoose-plugin-soft-delete" without the isDeleted declaration');
  }

  ['isDeleted', 'deletedBy', 'deleted'].forEach(function eachKey(key) {
    var declaration;
    var config = {};

    if (!options.declaration[key]) {
      return;
    }

    declaration = options.declaration[key];
    config[declaration.key] = declaration.config;

    schema.add(config);
  });

  schema.methods.delete = function del(by, callback) {
    if (!callback && isFunction(by) || !options.declaration.deletedBy) {
      callback = by;
      by = null;
    }

    if (!callback) {
      throw new Error('Argument one or two passed to #delete must be a function');
    }

    this[options.declaration.isDeleted.key] = true;

    if (options.declaration.deletedBy) {
      this[options.declaration.deletedBy.key] = by;
    }

    if (options.declaration.deleted) {
      this[options.declaration.deleted.key] = Date.now();
    }

    this.save(callback);
  };

  if (options.restorable) {
    schema.methods.restore = function restore(callback) {
      if (!isFunction(callback)) {
        throw new Error('Argument one passed to #restore must be a function');
      }

      this[options.declaration.isDeleted.key] = false;

      if (options.declaration.deletedBy) {
        this[options.declaration.deletedBy.key] = null;
      }

      if (options.declaration.deleted) {
        this[options.declaration.deleted.key] = null;
      }

      this.save(callback);
    };
  }
};
