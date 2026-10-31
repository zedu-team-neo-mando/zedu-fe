/**
 * Character policy for the status text field.
 *
 * The limit is counted in UTF-16 code units, the same unit the desktop client
 * and the native `maxlength` attribute use: 100 ASCII characters, or 50 simple
 * emoji, fill the field. Trimming removes whole characters (grapheme clusters
 * where the browser supports Intl.Segmenter), so a value can come back
 * shorter than 100 units when the next character would not fit whole.
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

type GraphemeSegmenter = {
  segment: (input: string) => Iterable<{ segment: string }>;
};

const createGraphemeSegmenter = (): GraphemeSegmenter | null => {
  const IntlWithSegmenter = Intl as typeof Intl & {
    Segmenter?: new (
      locale?: string,
      options?: { granularity: "grapheme" }
    ) => GraphemeSegmenter;
  };
  if (typeof IntlWithSegmenter.Segmenter !== "function") return null;
  return new IntlWithSegmenter.Segmenter(undefined, {
    granularity: "grapheme",
  });
};

const graphemeSegmenter = createGraphemeSegmenter();

/**
 * Returns a well-formed value that fits `STATUS_MAX_LENGTH` without splitting
 * a character. Where `Intl.Segmenter` is available the cut lands on a grapheme
 * boundary, so a family emoji (joined with U+200D) or a flag (two regional
 * indicators) is kept whole or dropped whole. Older browsers fall back to
 * never splitting a surrogate pair. Used for changes, paste, and the save
 * payload, so oversized or malformed text cannot reach the API.
 */
export const clampStatusText = (value: string): string => {
  // A native maxlength cut can leave the high half of a pair at the end;
  // drop it rather than turning it into U+FFFD.
  const trimmed =
    value.length > 0 && isHighSurrogate(value.charCodeAt(value.length - 1))
      ? value.slice(0, -1)
      : value;
  const wellFormed = toWellFormedStatusText(trimmed);

  if (wellFormed.length <= STATUS_MAX_LENGTH) return wellFormed;

  if (graphemeSegmenter) {
    let result = "";
    for (const { segment } of graphemeSegmenter.segment(wellFormed)) {
      if (result.length + segment.length > STATUS_MAX_LENGTH) break;
      result += segment;
    }
    return result;
  }

  let end = STATUS_MAX_LENGTH;
  // The cut would land between the halves of a surrogate pair: drop the high
  // surrogate instead of keeping an unpaired one.
  if (isHighSurrogate(wellFormed.charCodeAt(end - 1))) end -= 1;

  return wellFormed.slice(0, end);
};
