# mongoose-plugin-soft-delete
[![Circle CI](https://circleci.com/gh/MrBoolean/mongoose-plugin-soft-delete.svg?style=svg)](https://circleci.com/gh/MrBoolean/mongoose-plugin-soft-delete)

`mongoose-plugin-soft-delete` enables you:

* the possibility to add the soft-delete functionality with one single call
* a bunch of options to refine your requirements

# Install
```
npm i --save mongoose-plugin-soft-delete
```

# Usage
```javascript
var mongoose = require('mongoose');
var softDeletePlugin = require('mongoose-plugin-soft-delete');

var NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

NewsSchema.plugin(softDeletePlugin, {
  // ...
});

// ...
```

# Options
```javascript
{
  restorable: true, // enables / disables the "restore method"
  declaration: {
    isDeleted: {
      key: 'isDeleted', // the current status field name
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
}
```

## License
The MIT License (MIT)

Copyright (c) 2016 Marc Binder <marcandrebinder@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
