'use client';

import { Profiler, useMemo, type ReactNode } from 'react';
import {
  RENDER_BUDGET_MS,
  createRenderBudgetCallback,
  isRenderBudgetMonitoringEnabled,
} from '@/lib/observability/render-budget';

interface RenderBudgetMonitorProps {
  /** Identifies the wrapped subtree in the console warning. */
  id: string;
  children: ReactNode;
  /** Optional override of the 16.6ms (60fps) budget. */
  budgetMs?: number;
}

/**
 * Development-only wrapper that logs a console warning whenever the wrapped
 * subtree takes longer than one frame (16.6ms) to render.
 * In production it renders `children` untouched.
 */
export function RenderBudgetMonitor({
  id,
  children,
  budgetMs = RENDER_BUDGET_MS,
}: RenderBudgetMonitorProps) {
  const onRender = useMemo(
    () => createRenderBudgetCallback({ budgetMs }),
    [budgetMs],
  );

  if (!isRenderBudgetMonitoringEnabled()) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}