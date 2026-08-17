/**
 * Shared side-chat preference vocabulary (types + constants), consumed by
 * BOTH halves: the host registers the schemastery schema over these values
 * (index.ts) and the client reads/writes them through the plugin's own
 * fenced /sidechat settings routes. Kept free of schemastery so the browser
 * bundle never pulls the schema runtime in.
 */

/** The user-settings namespace holding the side-chat preferences. */
export const SUBCHAT_PREFS_NS = 'dsh-sidechat'

/** How a brought-back reply lands in the main conversation. */
export type BringMode = 'draft' | 'context'

/** User-facing side-chat preferences. */
export interface SubchatPrefs {
  /** Whether the "look up workspace / parent when needed" switch defaults on. */
  lookupDefault: boolean
  /** Whether selecting text sends it immediately (true) or stages it in the composer input without sending (false). */
  sendImmediately: boolean
  /** Extra prompt appended when the selection is sent immediately (empty = none). */
  defaultPrompt: string
  /** How brought-back content lands: into the composer draft, or as a collapsed context row. */
  bringMode: BringMode
}

/** Fallback prefs used whenever the settings document is unreachable or malformed. */
export const SUBCHAT_PREFS_DEFAULTS: SubchatPrefs = {
  lookupDefault: false,
  sendImmediately: false,
  defaultPrompt: '',
  bringMode: 'draft',
}
