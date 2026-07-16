"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { WorkflowConflict, WorkflowNotice, WorkflowOperation } from "@/components/admin/content-workflow/content-workflow-types";
import { getReloadedWorkflowState } from "@/components/admin/content-workflow/content-workflow-helpers";
import {
  discardDraft,
  isRevisionConflict,
  loadEditorSnapshot,
  publishDraft,
  saveDraft,
  type AdminWorkflowSection
} from "@/lib/content-workflow-client";
import type { EditorSnapshot, ScopeValue } from "@/types/content-workflow";

type SaveMode = "saving" | "resetting";

export function useContentWorkflow<TScope extends AdminWorkflowSection>(
  initialSnapshot: EditorSnapshot<TScope>,
  onPublished?: () => void
) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [value, setValue] = useState(initialSnapshot.data);
  const [dirty, setDirty] = useState(false);
  const [operation, setOperation] = useState<WorkflowOperation>(null);
  const [notice, setNotice] = useState<WorkflowNotice>("idle");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState<WorkflowConflict | null>(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const snapshotRef = useRef(snapshot);
  const valueRef = useRef(value);

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
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    setSnapshot(initialSnapshot);
    setValue(initialSnapshot.data);
    setDirty(false);
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
    setError(caught instanceof Error ? caught.message : "內容操作失敗，請稍後再試。");
  }, []);

  const changeValue = useCallback((nextValue: ScopeValue<TScope>) => {
    valueRef.current = nextValue;
    setValue(nextValue);
    setDirty(true);
    setNotice("dirty");
    setError("");
  }, []);

  const save = useCallback(async (
    overrideValue?: ScopeValue<TScope>,
    mode: SaveMode = "saving"
  ) => {
    const signal = begin(mode);
    if (!signal) return;
    const nextValue = overrideValue ?? valueRef.current;
    try {
      const nextSnapshot = await saveDraft(
        initialSnapshot.scope,
        nextValue,
        snapshotRef.current,
        { signal }
      );
      if (!mountedRef.current) return;
      snapshotRef.current = nextSnapshot;
      valueRef.current = nextSnapshot.data;
      setSnapshot(nextSnapshot);
      setValue(nextSnapshot.data);
      setDirty(false);
      setConflict(null);
      setNotice(mode === "resetting" ? "reset" : "saved");
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, fail, finish, initialSnapshot.scope]);

  const publish = useCallback(async () => {
    const current = snapshotRef.current;
    if (current.draftRevision === null || dirty || conflict) return;
    const signal = begin("publishing");
    if (!signal) return;
    try {
      const nextSnapshot = await publishDraft(initialSnapshot.scope, {
        draftRevision: current.draftRevision,
        publishedRevision: current.publishedRevision
      }, { signal });
      if (!mountedRef.current) return;
      snapshotRef.current = nextSnapshot;
      valueRef.current = nextSnapshot.data;
      setSnapshot(nextSnapshot);
      setValue(nextSnapshot.data);
      setDirty(false);
      setConflict(null);
      setNotice("published");
      onPublished?.();
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, conflict, dirty, fail, finish, initialSnapshot.scope, onPublished]);

  const discard = useCallback(async () => {
    const current = snapshotRef.current;
    if (current.draftRevision === null) return;
    const signal = begin("discarding");
    if (!signal) return;
    try {
      const nextSnapshot = await discardDraft(initialSnapshot.scope, current.draftRevision, { signal });
      if (!mountedRef.current) return;
      snapshotRef.current = nextSnapshot;
      valueRef.current = nextSnapshot.data;
      setSnapshot(nextSnapshot);
      setValue(nextSnapshot.data);
      setDirty(false);
      setConflict(null);
      setError("");
      setNotice("discarded");
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, fail, finish, initialSnapshot.scope]);

  const reload = useCallback(async () => {
    const signal = begin("reloading");
    if (!signal) return;
    try {
      const nextSnapshot = await loadEditorSnapshot(initialSnapshot.scope, { signal });
      if (!mountedRef.current) return;
      const reloaded = getReloadedWorkflowState(nextSnapshot);
      snapshotRef.current = reloaded.snapshot;
      valueRef.current = reloaded.value;
      setSnapshot(reloaded.snapshot);
      setValue(reloaded.value);
      setDirty(reloaded.dirty);
      setConflict(reloaded.conflict);
      setError(reloaded.error);
      setNotice(reloaded.notice);
    } catch (caught: unknown) {
      fail(caught);
    } finally {
      finish();
    }
  }, [begin, fail, finish, initialSnapshot.scope]);

  return {
    snapshot,
    value,
    dirty,
    operation,
    notice,
    error,
    conflict,
    changeValue,
    save,
    publish,
    discard,
    reload
  };
}
