"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getReloadedWorkflowState } from "@/components/admin/content-workflow/content-workflow-helpers";
import type { WorkflowConflict, WorkflowNotice, WorkflowOperation } from "@/components/admin/content-workflow/content-workflow-types";
import { isRevisionConflict } from "@/lib/content-workflow-client";
import type { PageBlockSettings } from "@/types/content";
import {
  discardPageBlockDraft,
  loadPageBlockEditorSnapshot,
  publishPageBlockDraft,
  savePageBlockDraft
} from "./page-block-workflow-helpers";
import type { PageBlockEditorPage, PageBlockEditorSnapshot } from "./page-block-editor-types";

type SaveMode = "saving" | "resetting";

export function usePageBlockWorkflow<TPage extends PageBlockEditorPage>(
  page: TPage,
  initialSnapshot: PageBlockEditorSnapshot<TPage>,
  onPublished?: () => void
) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [blocks, setBlocks] = useState<PageBlockSettings[TPage]>(initialSnapshot.data);
  const [dirty, setDirty] = useState(false);
  const [operation, setOperation] = useState<WorkflowOperation>(null);
  const [notice, setNotice] = useState<WorkflowNotice>("idle");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState<WorkflowConflict | null>(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const snapshotRef = useRef(snapshot);
  const blocksRef = useRef(blocks);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    snapshotRef.current = initialSnapshot;
    blocksRef.current = initialSnapshot.data;
    setSnapshot(initialSnapshot);
    setBlocks(initialSnapshot.data);
    setDirty(false);
    setOperation(null);
    setNotice("idle");
    setError("");
    setConflict(null);
  }, [initialSnapshot]);

  const begin = useCallback((nextOperation: Exclude<WorkflowOperation, null>): AbortSignal | null => {
    if (busyRef.current) return null;
    busyRef.current = true;
    const controller = new AbortController();
    controllerRef.current = controller;
    setOperation(nextOperation);
    setError("");
    return controller.signal;
  }, []);

  const finish = useCallback(() => {
    busyRef.current = false;
    controllerRef.current = null;
    if (mountedRef.current) setOperation(null);
  }, []);

  const fail = useCallback((caught: unknown) => {
    if (!mountedRef.current || (caught instanceof DOMException && caught.name === "AbortError")) return;
    if (isRevisionConflict(caught)) {
      setConflict({ revisions: caught.revisions });
      setNotice("conflict");
      setError("");
      return;
    }
    setNotice("error");
    setError(caught instanceof Error ? caught.message : "Page Block 操作失敗，請稍後再試。");
  }, []);

  const changeBlocks = useCallback((nextBlocks: PageBlockSettings[TPage]) => {
    blocksRef.current = nextBlocks;
    setBlocks(nextBlocks);
    setDirty(true);
    setNotice("dirty");
    setError("");
  }, []);

  const save = useCallback(async (
    overrideBlocks?: PageBlockSettings[TPage],
    mode: SaveMode = "saving"
  ) => {
    const signal = begin(mode);
    if (!signal) return;
    const nextBlocks = overrideBlocks ?? blocksRef.current;
    try {
      const nextSnapshot = await savePageBlockDraft(page, nextBlocks, snapshotRef.current, { signal });
      if (!mountedRef.current) return;
      snapshotRef.current = nextSnapshot;
      blocksRef.current = nextSnapshot.data;
      setSnapshot(nextSnapshot);
      setBlocks(nextSnapshot.data);
      setDirty(false);
      setConflict(null);
      setNotice(mode === "resetting" ? "reset" : "saved");
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, fail, finish, page]);

  const publish = useCallback(async () => {
    const current = snapshotRef.current;
    if (current.draftRevision === null || dirty || conflict) return;
    const signal = begin("publishing");
    if (!signal) return;
    try {
      const nextSnapshot = await publishPageBlockDraft(page, {
        draftRevision: current.draftRevision,
        publishedRevision: current.publishedRevision
      }, { signal });
      if (!mountedRef.current) return;
      snapshotRef.current = nextSnapshot;
      blocksRef.current = nextSnapshot.data;
      setSnapshot(nextSnapshot);
      setBlocks(nextSnapshot.data);
      setDirty(false);
      setConflict(null);
      setError("");
      setNotice("published");
      onPublished?.();
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, conflict, dirty, fail, finish, onPublished, page]);

  const discard = useCallback(async () => {
    const current = snapshotRef.current;
    if (current.draftRevision === null) return;
    const signal = begin("discarding");
    if (!signal) return;
    try {
      const nextSnapshot = await discardPageBlockDraft(page, current.draftRevision, { signal });
      if (!mountedRef.current) return;
      snapshotRef.current = nextSnapshot;
      blocksRef.current = nextSnapshot.data;
      setSnapshot(nextSnapshot);
      setBlocks(nextSnapshot.data);
      setDirty(false);
      setConflict(null);
      setError("");
      setNotice("discarded");
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, fail, finish, page]);

  const reload = useCallback(async () => {
    const signal = begin("reloading");
    if (!signal) return;
    try {
      const nextSnapshot = await loadPageBlockEditorSnapshot(page, { signal });
      if (!mountedRef.current) return;
      const reloaded = getReloadedWorkflowState(nextSnapshot);
      snapshotRef.current = reloaded.snapshot;
      blocksRef.current = reloaded.value;
      setSnapshot(reloaded.snapshot);
      setBlocks(reloaded.value);
      setDirty(reloaded.dirty);
      setConflict(reloaded.conflict);
      setError(reloaded.error);
      setNotice(reloaded.notice);
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, fail, finish, page]);

  return {
    snapshot,
    blocks,
    dirty,
    operation,
    notice,
    error,
    conflict,
    changeBlocks,
    save,
    publish,
    discard,
    reload
  };
}
