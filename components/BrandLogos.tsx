/* Brand logo SVG components — minimal, immediately recognizable */

interface IconProps { size?: number; className?: string; color?: string }

/* ── OpenAI / ChatGPT  (simple-icons path, MIT) ── */
export function OpenAIIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} aria-label="ChatGPT">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.193-3-2.02 1.17a.077.077 0 0 1-.071 0L6.82 6.74a4.494 4.494 0 0 1 6.68-4.66l-.14.08-4.779 2.758a.795.795 0 0 0-.392.681zm-1.071-2.303-.67-.387-4.773-2.758a.771.771 0 0 0-.78 0L6.819 9.675V7.342a.08.08 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-10.64 3.507-2.02-1.168a.08.08 0 0 1-.038-.057V6.075a4.494 4.494 0 0 1 7.375-3.453l-.14.08L7.625 5.46a.795.795 0 0 0-.392.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  )
}

/* ── Google Gemini — 4-pointed star (simple-icons path) ── */
export function GeminiIcon({ size = 24, color = 'white', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} aria-label="Gemini">
      <path d="M12 2C10.8 7.5 7.5 10.8 2 12c5.5 1.2 8.8 4.5 10 10 1.2-5.5 4.5-8.8 10-10-5.5-1.2-8.8-4.5-10-10z" />
    </svg>
  )
}

/* ── Anthropic / Claude — the "A" mountain mark (simple-icons path) ── */
export function ClaudeIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} aria-label="Claude">
      <path d="M13.827 3.087c-.49-1.116-2.164-1.116-2.654 0L3.842 20.7h3.058l1.632-3.712h7.936l1.632 3.712h3.058zm-4.18 10.854 2.853-6.494 2.853 6.494z" />
    </svg>
  )
}

/* ── Perplexity AI (simple-icons path) ── */
export function PerplexityIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} aria-label="Perplexity">
      <path d="M22 21h-2.153v-6.37l-4.71 4.695h-.274l-4.71-4.695V21H8v-9.186L4.727 15.2l-1.45-1.48L7.79 9.3 3.277 4.78l1.45-1.48 4.512 4.42L12 6.444l2.761 1.276 4.512-4.42 1.45 1.48L16.21 9.3l4.513 4.42-1.45 1.48L15.76 11.814V21zM12 3.977L9.758 9h4.484z" />
    </svg>
  )
}

/* ── Google AI — authentic colored G ── */
export function GoogleAIIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Google AI">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
