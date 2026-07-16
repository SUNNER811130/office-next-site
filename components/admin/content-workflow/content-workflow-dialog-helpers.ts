type ConfirmationGuard = { current: boolean };

export function claimDialogConfirmation(guard: ConfirmationGuard) {
  if (guard.current) return false;
  guard.current = true;
  return true;
}

export function isolateDialogBackground(documentNode: Document, portalRoot: HTMLElement) {
  const backgroundElements = Array.from(documentNode.body.children)
    .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== portalRoot)
    .map((element) => ({ element, inert: element.inert }));
  const previousOverflow = documentNode.body.style.overflow;

  for (const { element } of backgroundElements) element.inert = true;
  documentNode.body.style.overflow = "hidden";

  return () => {
    for (const { element, inert } of backgroundElements) element.inert = inert;
    documentNode.body.style.overflow = previousOverflow;
  };
}

export function getDialogFocusableElements(dialog: HTMLElement) {
  const selector = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  return Array.from(dialog.querySelectorAll<HTMLElement>(selector))
    .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
}

export function trapDialogTab(
  focusableElements: HTMLElement[],
  activeElement: Element | null,
  shiftKey: boolean
) {
  if (focusableElements.length === 0) return false;

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const activeIndex = activeElement ? focusableElements.indexOf(activeElement as HTMLElement) : -1;

  if (shiftKey && activeIndex <= 0) {
    last.focus();
    return true;
  }
  if (!shiftKey && (activeIndex === -1 || activeIndex === focusableElements.length - 1)) {
    first.focus();
    return true;
  }
  return false;
}
