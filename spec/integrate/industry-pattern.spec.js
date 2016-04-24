import { factory } from "industry"
import { functions } from "industry-functions"
import { instance } from "industry-instance"
import { standard_io } from "industry-standard-io"
import { pattern } from "../../"

console.log(pattern)

describe("pattern", () => {
  let test

  function makeTest(options) {
    test = factory()
      .set("functions", functions)
      .set("instance", instance)
      .set("pattern", pattern)
      .set("standard_io", standard_io)
      .base(class {
        beforeBeforeInit() {
          this.pattern({
            a: { a: true, b: "b" },
            b: { b: 1 },
            c: {}
          })
        }

        a({ args }) { return args }
        b({ args }) { return args }
        c({ args }) { return args }
      })
  }

  it("doesn't pass", () => {
    makeTest()
    expect(test().a().value).toBe(undefined)
    expect(test().a({ a: true }).value).toBe(undefined)
    expect(test().b().value).toBe(undefined)
    expect(test().b({ b: 0 }).value).toBe(undefined)
  })

  it("passes", () => {
    makeTest()
    console.log(test().a({ a: true, b: "b" }).value)
  })
})
