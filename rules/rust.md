---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
  - "**/rustfmt.toml"
---

Standard Rust version and edition:

   * Version: **`1.89.0`**
   * Edition: **`2024`**

## Code Standards

Follow the Rust community's default linting and formatting standards as defined by
`clippy` and `rustfmt`, with these exceptions:

```toml
# rustfmt.toml
tab_spaces = 3
hard_tabs = false
newline_style = "Unix"
remove_nested_parens = false
use_field_init_shorthand = true
use_try_shorthand = true
```

## Error Handling

Use the `thiserror` crate to define error types. If there are only a few error types, or
you do not need serializable errors, you may define an error enum without using
`thiserror`.

For Tauri projects, see Tauri's error handling suggestion.

## Documentation

* All Rust libraries/crates should have well-structured documentation available via `cargo
  doc --open`
* Follow the Rust documentation guidelines:
   * https://doc.rust-lang.org/rust-by-example/meta/doc.html
   * https://doc.rust-lang.org/book/ch14-02-publishing-to-crates-io.html
* Ensure the home page of generated docs explains the crate's purpose and usage
* Do not inline README.md into crate docs if it contains developer-only instructions. Use
  module-level `//!` comments or a separate `DEVELOPERS.md` instead
* For applications: add doc blocks to commonly-used modules, structs, enums, and functions
* **Always set code examples in doc blocks to `no_run`** to prevent `cargo test` from
  executing them

## Project Configuration Checklist

* `rust-toolchain.toml` file in the root
* `.cargo/config.toml` file with lint and fix aliases
* `Cargo.toml` with the standard edition and rust-version
* `rustfmt.toml` with the settings above
* Up-to-date README with linting and fixing instructions

### Toolchain Configuration

```toml
# rust-toolchain.toml
[toolchain]
channel = "1.88.0"
components = [
   "rustfmt",
   "clippy"
]
```

### Linting Commands

```sh
# Check
cargo clippy --all-targets --all-features -- -D warnings && cargo fmt -- --check

# Fix
cargo clippy --all-targets --all-features --fix && cargo fmt
```

### Cargo Linting Aliases

```toml
# .cargo/config.toml
[alias]
lint-clippy = "clippy --all-targets --all-features -- -D warnings"
fix-clippy = "clippy --fix"
lint-fmt = "fmt -- --check"
fix-fmt = "fmt"
```

For projects with JavaScript/TypeScript, add `rust:lint` to `npm run standards`:

```json
{
   "scripts": {
      "rust:lint": "cargo lint-clippy && cargo lint-fmt",
      "rust:lint:fix": "cargo fix-clippy && cargo fix-fmt",
      "standards": "npm run rust:lint"
   }
}
```

### Cargo.toml Requirements

* `[package] name`, `description`, `version` (semver, start at `0.1.0`)
* `[package] edition` — use the standard edition
* `[package] rust-version` — match `rust-toolchain.toml`

### Dependencies

* Always pin to exact semver versions. No caret, tilde, wildcard, or comparison
 requirements
* When using `git` dependencies, specify a tag or hash, not a branch
* Do not introduce new dependencies not used in other Silvermine projects without
 consulting the team

## Tests

* Unit tests in the same file as the code
* Integration tests in a `tests` folder sibling to `src`
* Do not write documentation tests. Always annotate code in doc blocks with `no_run`
