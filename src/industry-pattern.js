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

  if (typeof pattern == "function") {
    pass = matchFn({ arg: merged, fn: pattern })
  } else if (Array.isArray(pattern)) {
    pass = matchOr({ args: merged, pattern })
  } else {
    pass = matchAnd({ args: merged, pattern })
  }

  if (pass) {
    value = fn.bind(bind_to)(...args)
  } else {
    value = returnObject({ value: {} })
  }
  
  return value
}

function matchAnd({ args, pattern }) {
  let pass = true
  for (let arg in pattern) {
    let a = args[arg]
    let p = pattern[arg]
    let match = matchType({ arg: a, type: p })
    if (match == undefined) {
      match = matchFn({ arg: a, fn: p }) || a == p
    }
    if (!match) { pass = false }
  }
  return pass
}

function matchFn({ arg, fn }) {
  return typeof fn == "function" && !!fn(arg)
}

function matchOr({ args, pattern }) {
  let pass = false
  pattern.forEach(p => {
    pass = pass || matchAnd({ args, pattern: p })
  })
  return pass
}

function matchType({ arg, type }) {
  let types = [ String, Number, Boolean, Object, Array ]
  let index = types.indexOf(type)
  if (index == -1) { return undefined }
  else return arg != undefined && arg.constructor == type
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

    beforeInit() {
      if (this.pattern) {
        patch.bind(this)(this.pattern())
      }
      super.beforeInit()
    }
  }
