---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---

These standards supplement the general Silvermine coding standards. Where Swift community
conventions conflict with the general standard, the Swift-specific rule takes precedence.

## Core Principles

* Prefer value types (structs) over reference types (classes) unless you need identity
  semantics or inheritance
* Leverage Swift's type system for safety (optionals, enums with associated values,
  protocols)
* Use Swift Concurrency (async/await, actors) over callback patterns
* Follow Swift API Design Guidelines for naming

## Formatting

* One blank line between method definitions
* No blank line after opening brace or before closing brace
* One space after colon in type declarations, no space before
* Break long lines at logical points; indent continuation lines by 3 spaces

## Naming Conventions

**Overrides from general standard:** Swift uses camelCase for all functions and properties,
including static members. Do not use `snake_case` for static functions,
`UPPER_SNAKE_CASE` for constants, or underscore prefixes for private members.

* **camelCase** for all variables, functions, and properties (including static)
* **PascalCase** for types (classes, structs, enums, protocols)
* Constants use `let` with camelCase (not `UPPER_SNAKE_CASE`)
* Verbs for functions that perform actions
* Noun phrases for functions returning values without side effects
* Omit `get` and `list` prefixes for accessor methods
* Boolean properties: `is`, `has`, `can`, `should` prefixes
* Enum case names: lowerCamelCase
* Protocols: nouns for what something _is_; `-able`/`-ible`/`-ing` for capabilities

### Function Examples

```swift
// Good
func remove(at index: Int)
func user(id: String) -> User?
func activeUsers() -> [User]
func fetchUser(id: String) async throws -> User

// Bad
func removeItem(atIndex index: Int)
func getUser(id: String) -> User?
func listUsers() -> [User]
```

## Code Organization

* Use the most restrictive access control possible; default to `private`
* One type per file unless types are closely related
* Ordering: properties, initializers, computed properties, public methods, private
  methods
* Use extensions to organize code by functionality (one protocol per extension)

### Value Types vs Reference Types

* Structs: simple data values, properties are themselves value types
* Classes: identity semantics or inheritance needed
* Actors: thread-safe shared mutable state

## Swift Features

### Optionals

* **Never** force unwrap (`!`) except in tests or when truly impossible to be nil
* Use optional binding (`if let`, `guard let`) for safe unwrapping
* Use nil coalescing (`??`) for default values

### Error Handling

* Use `throw`/`catch` for recoverable errors
* Use `guard` for early returns; the `else` block must exit scope
* Provide meaningful error types with enums

### Concurrency

* Use Swift Concurrency (`async`/`await`, actors)
* Leverage Swift 6 strict concurrency checking and `@Sendable` annotations
* Use `async let` for concurrent tasks
* Use actors for thread-safe shared mutable state

### Closures

* Use trailing closure syntax when the closure is the last argument
* Prefer named parameters over shorthand (`$0`, `$1`) for closures longer than a
  single expression
* Be explicit about capture lists

## Memory Management

* Avoid strong reference cycles with `weak` and `unowned`
* Use value types (structs) when appropriate to avoid reference cycle concerns
* Be explicit about capture lists in closures

```swift
func updateProfile() {
   networkService.fetch { [weak self] result in
      guard let self else { return }
      self.updateUI(with: result)
   }
}
```

## Documentation

Swift uses `///` documentation comments with `- Parameters:` and `- Returns:` markup
instead of JSDoc:

```swift
/// Calculates the total price including tax
///
/// - Parameters:
///   - items: The items to calculate the price for.
///   - taxRate: The tax rate to apply.
/// - Returns: The total price with tax applied
func calculateTotal(for items: [Item], taxRate: Double) -> Double {
   // Implementation
}
```

## Testing

* Prefer Swift Testing framework (`@Test`, `#expect`) over XCTest for new tests
* Test all public interfaces
* Follow Arrange-Act-Assert pattern

## Dependency Management (Swift Package Manager)

* Always specify exact versions for dependencies
* Avoid version ranges or branch dependencies in production code

```swift
// Good
dependencies: [
    .package(url: "https://github.com/apple/swift-log.git", exact: "1.4.2"),
]

// Bad
dependencies: [
    .package(url: "https://github.com/apple/swift-log.git", from: "1.0.0"),
]
```
