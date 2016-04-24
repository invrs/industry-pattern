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
      hello: { noun: (v) => typeof v == "string" }
    })
  }

  hello({ noun }) {
    return "hello ${noun}"
  }
}

let test = factory(Test)
  .set("functions", functions)
  .set("instance", instance)
  .set("pattern", pattern)
  .set("standard_io", standard_io)

test().hello({ noun: 123 })     // { value: undefined }
test().hello({ noun: "world" }) // { value: "hello world" }
```
