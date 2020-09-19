/**
 * Show validation errors to the component
 *
 * @param   {Object}  fields  
 * @param   {Object}  errors  
 *
 * @return  {void}          
 */
export function showValidationErrors(fields, errors) {
  const errorsKeys = Object.keys(errors)

  for (const field in fields) {
    if (errorsKeys.includes(field)) {
      fields[field] = errors[field][0]
    } else {
      fields[field] = null
    }
  }
}

/**
 * Clear validation errros.
 *
 * @param   {Object}  fields  
 *
 * @return  {void}          
 */
export function clearValidationErrors(fields) {
  for (const field in fields) {
    fields[field] = null
  }
}