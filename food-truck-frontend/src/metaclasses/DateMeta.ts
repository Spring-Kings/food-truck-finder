import * as t from 'io-ts'

const dateIsGood = (input: unknown): input is Date => {
  if (typeof input === 'object' && input instanceof Date)
    return true;
  if (typeof input === 'number') // Support epoch times
    return true;
  else if (typeof input !== 'string')
    return false;
  const epochTime = Date.parse(input);
  return !isNaN(epochTime);
}

// Represents Date, can encode outputs to string, can parse unknown type
const DateMeta = new t.Type<Date, string, unknown>(
  'Date',

  // check if input is valid
  dateIsGood,

  // `t.success` and `t.failure` are helpers used to build `Either` instances
  (input, context) => (dateIsGood(input) ? t.success(input) : t.failure(input, context)),

  (date: Date): string => date.toISOString()
)

export default DateMeta;