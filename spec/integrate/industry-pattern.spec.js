import { factory } from "industry"
import { functions } from "industry-functions"
import { instance } from "industry-instance"
import { standard_io } from "industry-standard-io"
import { pattern } from "../../"

describe("pattern", () => {
  let test

  function makeTest(options) {
    test = factory()
      .set("functions", functions)
      .set("instance", instance)
      .set("pattern", pattern)
      .set("standard_io", standard_io)
      .base(class {
        init() {
          this.pattern({
            a: { a: Boolean, b: String },
            b: [ { b: 1 }, { b: Boolean } ],
            c: {},
            d: { d: v => typeof v == "string" }
          })
        }

        a({ args }) { return args }
        b({ args }) { return args }
        c({ args }) { return args }
        d({ args }) { return args }
      })
  }

  it("doesn't pass", () => {
    makeTest()
    expect(test().a().value).toBe(undefined)
    expect(test().a({ a: true }).value).toBe(undefined)
    expect(test().b().value).toBe(undefined)
    expect(test().b({ b: 0 }).value).toBe(undefined)
    expect(test().d({ d: 0 }).value).toBe(undefined)
  })

  it("passes", () => {
    makeTest()
    let a = { a: true, b: "b", whatev: true }
    let b = { b: 1, whatev: true }
    let b2 = { b: true, whatev: true }
    let c = { whatev: true }
    let d = { d: "hello", whatev: true }
    expect(test().a(a).value).toEqual(a)
    expect(test().b(b).value).toEqual(b)
    expect(test().b(b2).value).toEqual(b2)
    expect(test().c(c).value).toEqual(c)
    expect(test().d(d).value).toEqual(d)
  })
})
