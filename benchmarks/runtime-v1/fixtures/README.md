# Runtime V1 benchmark fixtures

Fixtures are deterministic mutations applied only to an isolated benchmark
workspace. They never modify the source worktree.

The scenario manifest uses four operation types:

- `replace` changes an exact source fragment;
- `write` creates a neutral benchmark target file;
- `remove-file` deletes a known golden source in the isolated copy;
- registry and documentation operations remove a public record or one
  `DsComponentSpec` block for gap-reconstruction scenarios.

The unmodified source snapshot is the golden state for `exact-edit`, `repair`,
`extend`, and accepted `create` scenarios. Rubrics, scenarios, and fixture
definitions are excluded from the agent workspace after the mutation is
applied, preventing answer leakage.

Patch files may be added for fixtures that are clearer as unified diffs. The
runner also supports declarative operations because registry and documentation
records cannot be removed safely with line-number-dependent patches.

