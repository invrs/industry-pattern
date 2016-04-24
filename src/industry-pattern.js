import { mergeObjects, returnObject } from "standard-io"

function patch(patterns) {
  for (let name in patterns) {
    let fn = this[name]
    let pattern = patterns[name]
    if (fn) {
      this[name] = (...args) =>
        match({ args, fn, pattern, name, bind_to: this })
    }
  }
}

function match({ args, fn, pattern, name, bind_to }) {
  let merged = mergeObjects(args)
  let pass, value

  if (Array.isArray(pattern)) {
    pass = matchOr({ args, pattern })
  } else {
    pass = matchAnd({ args, pattern })
  }

  if (pass) {
    value = fn.bind(bind_to)(...args)
  } else {
    value = returnObject()
  }
  
  return value
}

function matchAnd({ args, pattern }) {
  let pass = true
  for (let arg in pattern) {
    let a = args[arg]
    let p = pattern[arg]
    let match = (
      matchType({ arg: a, type: p }) ||
      matchFn({ arg: a, fn: p }) ||
      a == p
    )
    if (!match) { pass = false }
  }
  return pass
}

function matchFn({ arg, fn }) {
  return typeof fn == "function" && !!fn(arg)
}

function matchOr({ args, pattern }) {
  let pass = false
  pattern.each(p => {
    pass = pass || matchAnd({ args, pattern: p })
  })
  return pass
}

function matchType({ arg, type }) {
  let types = [ String, Number, Boolean, Object, Array ]
  let index = types.indexOf(type)
  return index > -1 && arg instanceof type
}

export let pattern = Class =>
  class extends Class {
    static beforeFactoryOnce() {
      this.industry({
        ignore: {
          Class: [ "pattern" ],
          instance: [ "pattern" ]
        }
      })
      super.beforeFactoryOnce()
    }

    pattern(patterns) {
      patch.bind(this)(patterns)
    }

    static pattern(patterns) {
      patch.bind(this)(patterns)
    }
  }
