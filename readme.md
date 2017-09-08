Create a `.env` file in the root directory of your project. Add
environment-specific variables on new lines in the form of `NAME=VALUE`.
As Below:

```dosini
accesskey=xyz
secretkey=abc/abc
accountnumbers=[1234,43345]
```

That's it.

`process.env` now has the keys and values you defined in your `.env` file.

```javascript
var db = require('db')
db.connect({
  accesskey: process.env.accesskey,
  secretkey: process.env.secretkey,
  acccountnumbers: process.env.accountnumbers
})
```