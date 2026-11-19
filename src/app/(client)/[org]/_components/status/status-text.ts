/**
 * Character policy for the status text field.
 *
 * The limit is counted in UTF-16 code units, the same unit the desktop client
 * and the native `maxlength` attribute use: 100 ASCII characters, or 50 simple
 * emoji, fill the field. Trimming always removes a whole code point, so a value
 * can come back at 99 units when the 100th unit would have been the high half
 * of a surrogate pair.
 */
export const STATUS_MAX_LENGTH = 100;

const HIGH_SURROGATE_START = 0xd800;
const HIGH_SURROGATE_END = 0xdbff;
const LOW_SURROGATE_START = 0xdc00;
const LOW_SURROGATE_END = 0xdfff;
const REPLACEMENT_CHARACTER = "\uFFFD";

const isHighSurrogate = (code: number) =>
  code >= HIGH_SURROGATE_START && code <= HIGH_SURROGATE_END;

const isLowSurrogate = (code: number) =>
  code >= LOW_SURROGATE_START && code <= LOW_SURROGATE_END;

/**
 * Replaces unpaired surrogates with U+FFFD, mirroring
 * `String.prototype.toWellFormed()`, which is not available in every browser
 * this app still supports.
 */
export const toWellFormedStatusText = (value: string): string => {
  let result = "";

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    if (isHighSurrogate(code)) {
      const next = value.charCodeAt(index + 1);
      if (isLowSurrogate(next)) {
        result += value[index] + value[index + 1];
        index += 1;
      } else {
        result += REPLACEMENT_CHARACTER;
      }
    } else if (isLowSurrogate(code)) {
      result += REPLACEMENT_CHARACTER;
    } else {
      result += value[index];
    }
  }

  return result;
};

/**
 * Returns a well-formed value that fits `STATUS_MAX_LENGTH` without ever
 * splitting a surrogate pair. Used for changes, paste, and the save payload,
 * so oversized or malformed text cannot reach the API.
 */
export const clampStatusText = (value: string): string => {
  const wellFormed = toWellFormedStatusText(value);

  if (wellFormed.length <= STATUS_MAX_LENGTH) return wellFormed;

  let end = STATUS_MAX_LENGTH;
  // The cut would land between the halves of a surrogate pair: drop the high
  // surrogate instead of keeping an unpaired one.
  if (isHighSurrogate(wellFormed.charCodeAt(end - 1))) end -= 1;

  return wellFormed.slice(0, end);
};
