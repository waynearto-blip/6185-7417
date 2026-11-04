#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const registryPath = path.join(__dirname, '..', 'registry', 'rail-matrix.json');
const schemaPath = path.join(__dirname, '..', 'schemas', 'rail-matrix.schema.json');
const errors = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${path.relative(process.cwd(), filePath)}: ${error.message}`);
    return null;
  }
}

const registry = readJson(registryPath);
const schema = readJson(schemaPath);

if (registry && schema) {
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    errors.push('Schema must declare JSON Schema draft 2020-12.');
  }
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    errors.push('Registry root must be an object.');
  } else {
    for (const key of Object.keys(registry)) {
      if (!['schemaVersion', 'governance', 'rails'].includes(key)) errors.push(`Unexpected root property: ${key}`);
    }
    if (typeof registry.schemaVersion !== 'string' || registry.schemaVersion.length === 0) errors.push('schemaVersion must be a non-empty string.');
    const governance = registry.governance;
    if (!governance || typeof governance !== 'object' || Array.isArray(governance)) {
      errors.push('governance must be an object.');
    } else {
      const expected = { classification: 'observational-template', validationAuthority: 'RESERVED', execution: 'HOLD' };
      for (const [key, value] of Object.entries(expected)) {
        if (governance[key] !== value) errors.push(`governance.${key} must be ${JSON.stringify(value)}.`);
      }
      if (typeof governance.notice !== 'string' || !governance.notice.trim()) errors.push('governance.notice must be a non-empty string.');
      for (const key of Object.keys(governance)) {
        if (!['classification', 'validationAuthority', 'execution', 'notice'].includes(key)) errors.push(`Unexpected governance property: ${key}`);
      }
    }

    const rails = registry.rails;
    const ids = new Set();
    const allowedClassifications = new Set(['TEXT', 'FACT', 'EVIDENCE', 'INFERENCE', 'OUTPUT', 'GOVERNANCE']);
    const allowedStatuses = new Set(['IDENTIFIED', 'REGISTERED', 'DECLARED', 'PENDING', 'HOLD', 'OPEN', 'RESERVED']);
    const required = ['id', 'artifact', 'classification', 'source', 'verification', 'status', 'dependencies', 'output'];

    if (!Array.isArray(rails) || rails.length === 0) {
      errors.push('rails must be a non-empty array.');
    } else {
      rails.forEach((rail, index) => {
        const label = `rails[${index}]`;
        if (!rail || typeof rail !== 'object' || Array.isArray(rail)) {
          errors.push(`${label} must be an object.`);
          return;
        }
        for (const key of required) if (!(key in rail)) errors.push(`${label}.${key} is required.`);
        for (const key of Object.keys(rail)) if (!required.includes(key)) errors.push(`${label} has unexpected property ${key}.`);
        if (typeof rail.id !== 'string' || !/^RAIL-[0-9]{4}$/.test(rail.id)) errors.push(`${label}.id must match RAIL-0000 format.`);
        else if (ids.has(rail.id)) errors.push(`Duplicate rail id: ${rail.id}.`);
        else ids.add(rail.id);
        for (const key of ['artifact', 'source', 'verification', 'output']) {
          if (typeof rail[key] !== 'string' || !rail[key].trim()) errors.push(`${label}.${key} must be a non-empty string.`);
        }
        if (!allowedClassifications.has(rail.classification)) errors.push(`${label}.classification is not an allowed value.`);
        if (!allowedStatuses.has(rail.status)) errors.push(`${label}.status is not an allowed value.`);
        if (!Array.isArray(rail.dependencies)) {
          errors.push(`${label}.dependencies must be an array.`);
        } else {
          const seen = new Set();
          for (const dep of rail.dependencies) {
            if (typeof dep !== 'string' || !/^RAIL-[0-9]{4}$/.test(dep)) errors.push(`${label} has an invalid dependency id.`);
            if (seen.has(dep)) errors.push(`${label} has duplicate dependency ${dep}.`);
            seen.add(dep);
          }
        }
      });
      for (const rail of rails) {
        if (rail && typeof rail.id === 'string' && Array.isArray(rail.dependencies)) {
          for (const dep of rail.dependencies) if (!ids.has(dep)) errors.push(`${rail.id} references unknown dependency ${dep}.`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error('Rail Matrix structural validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Rail Matrix structure is valid (${registry.rails.length} rails).`);
  console.log('This result is structural only; it is not evidence of conformance or authority.');
}
