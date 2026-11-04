# Rail Matrix OS: draft registry template

## Purpose and boundary

This registry is an observational template for recording artifacts and declared dependencies. It separates the content being recorded from the conclusions a reviewer might draw:

`TEXT → FACT → EVIDENCE → INFERENCE → OUTPUT`

The registry and its validator check structure and reference consistency only. They do not establish that a requirement is normative, that evidence is valid, that execution occurred, or that a conformance claim is true. Validation Authority remains `RESERVED`; execution remains `HOLD`.

## Files

- `registry/rail-matrix.json` — example registry, intentionally marked as a template.
- `schemas/rail-matrix.schema.json` — JSON Schema draft 2020-12 shape constraints.
- `scripts/validate-rail-matrix.js` — dependency-free structural checks, including duplicate IDs and unknown dependency references.

Run the validator from the repository root:

```sh
npm run validate:rail-matrix
```

The script uses Node.js built-ins and does not change application runtime behavior. It implements the documented structural checks directly; use a JSON Schema 2020-12 implementation to independently evaluate the schema file.

## Record fields

| Field | Meaning | Structural rule |
|---|---|---|
| `id` | Stable rail identifier | Unique `RAIL-0000` form |
| `artifact` | Artifact label | Non-empty string |
| `classification` | Declared information class | `TEXT`, `FACT`, `EVIDENCE`, `INFERENCE`, `OUTPUT`, or `GOVERNANCE` |
| `source` | Declared source name | Non-empty string; provenance is not verified |
| `verification` | Declared verification note | Non-empty string; not itself a verification result |
| `status` | Workflow disposition | Allowed status enum in the JSON Schema |
| `dependencies` | Referenced rail IDs | Unique IDs; every reference must exist |
| `output` | Descriptive output label | Non-empty string |

A successful validator run means only that the file satisfies these implemented structural checks. It does not execute test vectors, verify expected outputs, check source authenticity, determine semantic coverage, or generate a conformance report.

## Layer model and identifiers

The proposed layers are L0 Governance, L1 Normative Specifications, L2 Requirement Registry, L3 Algorithm Registry, L4 Schema Registry, L5 Test Vector Corpus, L6 Traceability Matrix, L7 Verification Engine, L8 Conformance Reports, L9 Audit Ledger, and L10 Registry/Release Package.

Suggested identifier prefixes: `REQ-*`, `ALG-*`, `SCH-*`, `VEC-*`, `EXP-*`, `TRC-*`, `RPT-*`, `AUD-*`, `WIT-*`, and `DEP-*`. These prefixes are guidance only; this initial rail schema validates `RAIL-*` IDs and does not yet define the formats of those other record types.

## Field lifecycle policy (proposal, not enforced by this schema)

- **Immutable by policy:** `id`, `schema`, `created`, `identity`.
- **Versioned:** `entryVersion`, `modified`.
- **Mutable descriptive metadata:** `notes`, `references`.
- **Derived:** `bitLength`, `binaryForm`, only when a separately published deterministic rule defines their derivation.

These lifecycle fields are not part of the current rail record shape. Enforcing immutability requires comparing revisions or append-only history; a JSON Schema validating one document cannot prove that a value was not changed over time. Derived values require an explicit algorithm and separate computation/checking before they can be treated as verified.

## Maturity and interoperability

A project may progress from an individual Markdown/spreadsheet record, to Git-reviewed records and generated matrices, to CI-generated artifacts, and—where governance requires it—to an RM/ALM system. Keep the logical relationships stable across tools and provide open exports (JSON/CSV/Markdown) where practical. Tool choice does not confer authority.

The intended traceability relationship is:

`Normative requirement → Requirement identifier → Test vector → Expected observable output → Traceability entry → Verification execution → Conformance report → Audit record`

The sample entries contain declared placeholders and pending states, not validated conformance evidence. Existing application code and sealed records are not modified by this draft extension.
