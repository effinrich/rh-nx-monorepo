type OptionBase = { value: string }

/**
 * Allow forms to keep primitive values while Combobox options retain
 * their complete label/value objects at the component boundary.
 *
 * This allows us to translate between our Summary <-> Command
 * API objects, where our Form state represents a Command.
 */
export const selectTransformer = {
  /**
   * @param options list of available options
   * @param value raw value
   * @returns Option
   */
  input<T extends OptionBase>(options: T[], value?: string | null) {
    return options.find(o => o.value === value)
  },
  /**
   * @param newValue Option
   * @returns raw value
   */
  output<T extends OptionBase>(newValue: T | null) {
    return newValue?.value ?? ''
  }
}

/**
 * Handle multi-select version of {@link selectTransformer}
 */
export const multiSelectTransformer = {
  /**
   * @param options list of available options
   * @param value raw values
   * @returns Option[]
   */
  input<T extends OptionBase>(options: T[], value?: string[]) {
    return options.filter(o => value?.some(v => v === o.value))
  },
  /**
   * @param newValue Option[]
   * @returns raw values
   */
  output<T extends OptionBase>(newValue: readonly T[]) {
    return newValue.map(v => v.value)
  }
}
