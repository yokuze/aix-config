---
paths:
  - "**/src-tauri/**/*.rs"
  - "**/src-tauri/Cargo.toml"
  - "**/src-tauri/tauri.conf.json"
  - "**/src-tauri/tauri.conf.json5"
  - "**/src-tauri/tauri.conf.toml"
  - "**/tauri.conf.json"
  - "**/tauri.conf.json5"
  - "**/tauri.conf.toml"
---

* Assume Rust code must compile and run on Android, iOS, and Windows in addition to
  macOS/Linux. This applies to both Tauri projects and pure Rust crates.
* Account for platform differences, especially:
   * C library bindings (for example SQLite ABI, pointer sizes, and calling conventions)
   * Conditional compilation (`#[cfg(target_os = ...)]`) when platform-specific behavior
     is unavoidable
   * File path handling (use `std::path::Path`, not string manipulation)
   * Platform-specific dependencies and feature flags in `Cargo.toml`
* When introducing or modifying FFI/unsafe code, verify that types and assumptions hold
  across all target platforms, especially 32-bit Android ARM versus 64-bit desktop.
