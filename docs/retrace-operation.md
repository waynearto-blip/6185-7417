# Retrace Operation — Draft Notation

**Status: PROPOSED / NON-NORMATIVE / NON-EXECUTABLE**

This document records a normalized interpretation of the supplied `364.072.001` retrace descriptor. It is a specification draft only: it does not execute code, authorize recovery or rollback, identify a real artifact, or establish conformance. Terms such as `glyph`, `rail`, `CAT`, `AU`, `clawback`, and the coordinate tuple have no standardized meaning here until separately defined by a normative specification.

## Normalized operation record

```yaml
operation:
  identifier: "364.072.001"
  action: retrace
  scope: necessary_code_base
  recovery:
    mode: clawback
    set: recovery_set
  target:
    type: glyph
    id: 79
    profile: AU
    subsystem: rail
    namespace: prologue.logos.logic.local
    category: CAT
    coordinate: [61, 85, 74, 17]
```

This representation preserves the supplied values while making their field boundaries explicit. It is not yet a validated schema.

## Separation of concerns

| Concern | Fields | Intended role in this draft |
|---|---|---|
| Identity | `operation.identifier`, `target.id`, `target.coordinate` | Identify the operation and referenced target within the proposed notation |
| Structure | `target.type`, `namespace`, `category`, `subsystem` | Describe the target's structural classification and location |
| Semantics | `profile`, `recovery.mode`, `recovery.set` | Reserved for definitions by a future profile/specification |
| Behavior | `action`, `scope` | Declare the requested operation and its stated scope |
| Evidence | Not supplied | Future execution evidence would need provenance, inputs, outputs, and validation results |

## Abstract contract (proposal)

**Operation type:** `Retrace`

**Inputs:** target identifier, namespace, profile, recovery mode, scope.

**Proposed processing stages:**

1. Resolve the namespace under a specified registry/profile.
2. Resolve and verify the target identity.
3. Resolve the profile and recovery-set definition.
4. Construct the required dependency graph.
5. Determine the minimum dependency set under explicit inclusion rules.
6. Produce a recovery-artifact-set description and provenance record.
7. Validate the result against a separately published profile and record evidence.

**Candidate outputs:** recovery artifact set, provenance record, validation evidence, operation log.

These stages describe a future contract; they do not imply that an implementation or recovery set currently exists. A real implementation must define authorization, scope boundaries, failure behavior, and whether any operation is read-only or mutating before execution is permitted.

## Illustrative grammar

The following EBNF is a starting point for the normalized record, not a normative grammar:

```ebnf
operation   = identifier, action, scope, recovery, target ;
identifier  = integer, ".", integer, ".", integer ;
action      = "retrace" | "validate" | "resolve" | "recover" ;
scope       = identifier | quoted-string ;
recovery    = "recovery", "(", "mode", "=", recovery-mode,
              ",", "set", "=", identifier, ")" ;
recovery-mode = "clawback" ;
target      = "glyph", "(", "id", "=", integer,
              ",", "profile", "=", identifier,
              ",", "subsystem", "=", identifier,
              ",", "namespace", "=", namespace,
              ",", "category", "=", identifier,
              ",", "coordinate", "=", coordinate, ")" ;
namespace   = identifier, { ".", identifier } ;
coordinate  = "(", integer, ":", integer, ":", integer, ":", integer, ")" ;
```

The grammar is deliberately illustrative: token types, quoting/escaping, integer ranges, namespace resolution, and canonical serialization remain unspecified. The YAML example is the clearest field-oriented representation in this draft.

## Semantics still required

A normative edition would need to define at minimum:

- `retrace`: exact selection and dependency-closure rules;
- `clawback`: whether this means restoration, rollback, retrieval, or another operation, and its authorization and safety constraints;
- `glyph`, `rail`, `CAT`, and profile `AU`: registries, types, and resolution rules;
- coordinate identity: ordering, uniqueness, stability, and relation to persistent/contextual identifiers;
- scope: permitted resources and boundary enforcement;
- errors, partial results, idempotency, and reproducibility;
- evidence format, provenance fields, validation procedures, and conformance criteria.

Until these are defined and tested, the descriptor remains a proposed symbolic operation record. No execution, recovery, verification, conformance, or sealing is claimed.
