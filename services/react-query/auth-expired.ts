let open = false;

export function triggerAuthExpired() {
  if (open) return;
  open = true;
  window.dispatchEvent(new CustomEvent("auth-expired"));
}

export function resetAuthExpired() {
  open = false;
}
