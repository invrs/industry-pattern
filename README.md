# IndustryPattern [![Build Status](https://travis-ci.org/invrs/industry-pattern.svg?branch=master)](https://travis-ci.org/invrs/industry-pattern)

Pattern matching on factory class and instance methods.

## Usage

```js
import { factory } from "industry"
import { functions } from "industry-functions"
import { instance } from "industry-instance"
import { pattern } from "industry-pattern"
import { standard_io } from "industry-standard-io"

class Test {
  init() {
    this.pattern({
      and: { a: Number, b: String, c: "c" },
      or: [
        { a: Number },
        { b: 0 },
        { c: c => !!c }
      ]
    })
  }

  and({ a, b, c }) { return true }
  or({ a, b, c }) { return true }
}

let test = factory(Test)
  .set("functions", functions)
  .set("instance", instance)
  .set("pattern", pattern)
  .set("standard_io", standard_io)

test().and() // { value: undefined }
test().and({ a: 0, b: "b" }) // { value: undefined }
test().and({ a: 0, b: "b", c: "c" }) // { value: true }

test().or() // { value: undefined }
test().or({ a: 0, b: "b" }) // { value: undefined }
test().or({ a: 0, b: 0 }) // { value: true }
test().and({ c: true }) // { value: true }
```
