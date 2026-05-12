/* Brand logo SVG components — paths sourced from simple-icons (simpleicons.org, MIT) */

interface IconProps { size?: number; className?: string }

/* ── OpenAI / ChatGPT ── */
export function OpenAIIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="OpenAI">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2976V6.9651a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  )
}

/* ── Google Gemini ── */
export function GeminiIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Google Gemini">
      <defs>
        <linearGradient id="gem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 2 14.5 9 12 12C9.5 9 12 2 12 2Z M22 12C22 12 15 14.5 12 12C15 9.5 22 12 22 12Z M12 22C12 22 9.5 15 12 12C14.5 15 12 22 12 22Z M2 12C2 12 9 9.5 12 12C9 14.5 2 12 2 12Z"
        fill="url(#gem-grad)"
      />
    </svg>
  )
}

/* ── Claude / Anthropic ── */
export function ClaudeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Claude">
      <path d="M4.709 15.955l4.72-1.978.124.09-4.72 1.978zm14.216-8.773l-4.72 1.978-.123-.09 4.72-1.978zM4.71 8.05l4.72 1.978.123-.09-4.72-1.978zm14.215 7.905l-4.72-1.978.124-.09 4.72 1.978zM12 2.4L5.258 9.577l1.61 4.424L12 16.44l5.131-2.439 1.61-4.424zm0 0v14.04m-6.74-8.863L12 2.4m0 0l6.74 5.177M5.259 9.577l6.741 6.863m0 0l6.741-6.863M5.26 14.001L12 16.44m0 0l6.741-2.439" strokeWidth="0" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 1L4 9.5l1.8 4.95L12 17l6.2-2.55L20 9.5 12 1zm0 2.2L17.6 9.7 16 14 12 15.6 8 14 6.4 9.7 12 3.2z" />
    </svg>
  )
}

/* ── Perplexity ── */
export function PerplexityIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Perplexity">
      <path d="M22 21h-2.153v-6.37l-4.71 4.695h-.274l-4.71-4.695V21H8v-9.186L4.727 15.2l-1.45-1.48L7.79 9.3 3.277 4.78l1.45-1.48 4.512 4.42L12 6.444l2.761 1.276 4.512-4.42 1.45 1.48L16.21 9.3l4.513 4.42-1.45 1.48L15.76 11.814V21zM12 3.977L9.758 9h4.484z" />
    </svg>
  )
}

/* ── Google AI (colored G) ── */
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

/* ── Microsoft Copilot / Bing AI ── */
export function CopilotIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Microsoft Copilot">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#0078D4" />
      <path d="M12 6c-.796 2.914-.398 5.43 1.196 7.546C14.79 15.663 16.993 16.8 20 17c-2.73 1.667-5.46 1.667-8.19 0C9.08 15.333 7.627 13 7.627 10c0-1.6.457-2.933 1.373-4z" fill="white" fillOpacity="0.9" />
      <path d="M12 6c.796 2.914.398 5.43-1.196 7.546C9.21 15.663 7.007 16.8 4 17c2.73 1.667 5.46 1.667 8.19 0C14.92 15.333 16.373 13 16.373 10c0-1.6-.457-2.933-1.373-4z" fill="white" fillOpacity="0.6" />
    </svg>
  )
}
