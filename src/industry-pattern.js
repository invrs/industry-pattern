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
  let pass = true
  let value

  for (let arg in pattern) {
    let match = (
      typeof pattern[arg] == "function" &&
      !!pattern[arg](merged[arg])
    )
    match = match || merged[arg] == pattern[arg]
    if (!match) { pass = false }
  }

  if (pass) {
    value = fn.bind(bind_to)(...args)
  } else {
    value = returnObject()
  }
  
  return value
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
