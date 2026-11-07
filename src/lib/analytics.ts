// Fire-and-forget event beacon. Session id is a random UUID cached in
// localStorage (no cookies -> no consent banner needed). Posts to the
// api/track Vercel function, which does the actual insert using the
// service-role key (the client never touches analytics_events directly —
// RLS has no policies on it at all, by design).
//
// /api/* is served by Vercel in production and by the `vercelApiDev` plugin
// in vite.config.ts during `npm run dev`, so events are recorded in both. If
// the route is ever unavailable the fetch fails silently and the site is
// unaffected.

export type AnalyticsEventType = 'pageview' | 'resume_download' | 'contact_submit' | 'project_click';

function getSessionId(): string {
  try {
    const key = 'ej_session_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

export function trackEvent(
  eventType: AnalyticsEventType,
  extra: { path?: string; projectId?: string } = {}
): void {
  const payload = {
    sessionId: getSessionId(),
    eventType,
    path: extra.path ?? window.location.pathname,
    referrer: document.referrer || null,
    projectId: extra.projectId ?? null,
  };

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Analytics must never break the site.
  });
}
