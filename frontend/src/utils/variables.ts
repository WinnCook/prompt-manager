/**
 * Variable utilities for prompt templates
 *
 * Variables use the syntax: {{variable_name}} or {{variable_name:default_value}}
 */

export interface Variable {
  name: string;
  defaultValue?: string;
  value?: string;
}

export interface VariableSet {
  id: string;
  name: string;
  description?: string;
  variables: Record<string, string>; // variable name -> value
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parse variables from prompt content
 * @param content - Prompt content
 * @returns Array of variables
 */
export function parseVariables(content: string): Variable[] {
  // Regex to match {{variable}} or {{variable:default}}
  const regex = /\{\{([^}:]+)(?::([^}]*))?\}\}/g;
  const variables: Variable[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1].trim();
    const defaultValue = match[2]?.trim();

    // Avoid duplicates
    if (!seen.has(name)) {
      variables.push({
        name,
        defaultValue,
      });
      seen.add(name);
    }
  }

  return variables;
}

/**
 * Check if content has variables
 * @param content - Prompt content
 * @returns True if content has variables
 */
export function hasVariables(content: string): boolean {
  return /\{\{[^}:]+(?::[^}]*)?\}\}/.test(content);
}

/**
 * Replace variables in content with values
 * @param content - Prompt content
 * @param values - Variable values (name -> value)
 * @returns Content with variables replaced
 */
export function replaceVariables(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(/\{\{([^}:]+)(?::([^}]*))?\}\}/g, (match, name, defaultValue) => {
    const trimmedName = name.trim();
    const value = values[trimmedName];

    // Use provided value, or default value, or empty string
    return value !== undefined ? value : (defaultValue?.trim() || '');
  });
}

/**
 * Validate variable values
 * @param variables - Variables to validate
 * @param values - Variable values
 * @returns Array of error messages (empty if valid)
 */
export function validateVariableValues(
  variables: Variable[],
  values: Record<string, string>
): string[] {
  const errors: string[] = [];

  for (const variable of variables) {
    const value = values[variable.name];

    // Check if required (no default value) and missing
    if (variable.defaultValue === undefined && (!value || value.trim() === '')) {
      errors.push(`"${variable.name}" is required`);
    }
  }

  return errors;
}

/**
 * Get sample variable values for preview
 * @param variables - Variables
 * @returns Sample values
 */
export function getSampleValues(variables: Variable[]): Record<string, string> {
  const samples: Record<string, string> = {};

  for (const variable of variables) {
    // Use default if available, otherwise use placeholder
    samples[variable.name] = variable.defaultValue || `[${variable.name}]`;
  }

  return samples;
}

/**
 * Load variable sets from localStorage
 * @returns Array of variable sets
 */
export function loadVariableSets(): VariableSet[] {
  const data = localStorage.getItem('prompt-manager-variable-sets');
  if (!data) return [];

  try {
    const sets = JSON.parse(data);
    // Convert date strings back to Date objects
    return sets.map((set: any) => ({
      ...set,
      createdAt: new Date(set.createdAt),
      updatedAt: new Date(set.updatedAt),
    }));
  } catch (err) {
    console.error('Failed to load variable sets:', err);
    return [];
  }
}

/**
 * Save variable sets to localStorage
 * @param sets - Variable sets to save
 */
export function saveVariableSets(sets: VariableSet[]): void {
  try {
    localStorage.setItem('prompt-manager-variable-sets', JSON.stringify(sets));
  } catch (err) {
    console.error('Failed to save variable sets:', err);
  }
}

/**
 * Create a new variable set
 * @param name - Set name
 * @param description - Set description
 * @param variables - Variable values
 * @returns New variable set
 */
export function createVariableSet(
  name: string,
  description: string | undefined,
  variables: Record<string, string>
): VariableSet {
  return {
    id: `vs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    variables,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Update an existing variable set
 * @param set - Variable set to update
 * @param updates - Updates to apply
 * @returns Updated variable set
 */
export function updateVariableSet(
  set: VariableSet,
  updates: Partial<Omit<VariableSet, 'id' | 'createdAt' | 'updatedAt'>>
): VariableSet {
  return {
    ...set,
    ...updates,
    updatedAt: new Date(),
  };
}
