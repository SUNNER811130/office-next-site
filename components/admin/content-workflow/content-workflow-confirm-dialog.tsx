"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  claimDialogConfirmation,
  getDialogFocusableElements,
  isolateDialogBackground,
  trapDialogTab
} from "@/components/admin/content-workflow/content-workflow-dialog-helpers";

export function ContentWorkflowConfirmDialog({
  id,
  title,
  children,
  confirmLabel,
  tone = "default",
  onConfirm,
  onCancel
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [confirming, setConfirming] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const confirmationClaimedRef = useRef(false);

  useEffect(() => {
    const root = document.createElement("div");
    root.dataset.contentWorkflowDialogPortal = id;
    document.body.appendChild(root);
    setPortalRoot(root);

    return () => root.remove();
  }, [id]);

  useEffect(() => {
    if (!portalRoot) return;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const restoreBackground = isolateDialogBackground(document, portalRoot);
    cancelRef.current?.focus();

    return () => {
      restoreBackground();
      const trigger = triggerRef.current;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [portalRoot]);

  if (!portalRoot) return null;

  const cancel = () => {
    if (confirming) return;
    onCancel();
  };

  const confirm = () => {
    if (!claimDialogConfirmation(confirmationClaimedRef)) return;
    setConfirming(true);
    onConfirm();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/45 p-4 pointer-events-auto"
      data-content-workflow-dialog-overlay="true"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        aria-busy={confirming}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => {
          event.stopPropagation();
          if (!(event.target as HTMLElement).closest("button,[href],input,select,textarea,[tabindex]")) {
            event.preventDefault();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancel();
            return;
          }
          if (event.key === "Tab" && dialogRef.current) {
            const focusableElements = getDialogFocusableElements(dialogRef.current);
            if (trapDialogTab(focusableElements, document.activeElement, event.shiftKey) || focusableElements.length === 0) {
              event.preventDefault();
            }
          }
        }}
        className="w-full max-w-lg rounded-2xl border border-ink/15 bg-[#fcfaf7] p-4 shadow-2xl"
      >
        <h3 id={`${id}-title`} className="font-medium text-ink">{title}</h3>
        <div id={`${id}-description`} className="mt-2 grid gap-1 text-sm text-slate">{children}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={cancel}
            disabled={confirming}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40"
          >
            取消
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={confirming}
            aria-busy={confirming}
            className={tone === "danger"
              ? "rounded-full bg-red-800 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/40"
              : "rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40"}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
