* Always use Context7 when you need setup or configuration steps, or
  library/API documentation. Automatically use the Context7 MCP tools to resolve library
  ID and get library docs without being explicitly asked
* If you make UI changes, use MCP tools to test them in a real environment unless
  project-specific rules say not to
   * Use the Tauri MCP when working within a Tauri app
   * Use Playwright for other projects
* Use the fallow MCP in a TypeScript or JavaScript project before deleting an export, a
  file, or a dependency, and before opening an MR. `trace_export` and `impact_closure`
  list the consumers, `audit` reads the changed files, and `inspect_target` gathers the
  evidence for one file or symbol in a single call
