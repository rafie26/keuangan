let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function toggleMobileMenu() {
  open = !open;
  emit();
}

export function closeMobileMenu() {
  if (open) {
    open = false;
    emit();
  }
}

export function subscribeMobileMenu(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getMobileMenuState() {
  return open;
}
