import type { ProfilerOnRenderCallback } from 'react';

/** One 60fps frame: 1000ms / 60 ≈ 16.6ms. */
export const RENDER_BUDGET_MS = 16.6;

export interface RenderBudgetCallbackOptions {
  /** Budget in milliseconds. Defaults to {@link RENDER_BUDGET_MS}. */
  budgetMs?: number;
  /** Warning sink. Defaults to `console.warn`. */
  warn?: (message: string) => void;
}

/**
 * Render-budget monitoring is a development-only tool. It is disabled in
 * production builds so no profiling work or logging reaches end users.
 */
export function isRenderBudgetMonitoringEnabled(
  nodeEnv: string | undefined = process.env.NODE_ENV,
): boolean {
  return nodeEnv !== 'production';
}

/** True only when the render took strictly longer than the budget. */
export function isOverRenderBudget(
  actualDuration: number,
  budgetMs: number = RENDER_BUDGET_MS,
): boolean {
  return Number.isFinite(actualDuration) && actualDuration > budgetMs;
}

export function formatRenderBudgetWarning(
  id: string,
  phase: string,
  actualDuration: number,
  budgetMs: number = RENDER_BUDGET_MS,
): string {
  return (
    `[RenderBudgetMonitor] "${id}" ${phase} took ` +
    `${actualDuration.toFixed(1)}ms (budget ${budgetMs}ms)`
  );
}

/**
 * Builds a React Profiler `onRender` callback that warns when a commit
 * exceeds the frame budget.
 */
export function createRenderBudgetCallback(
  options: RenderBudgetCallbackOptions = {},
): ProfilerOnRenderCallback {
  const budgetMs = options.budgetMs ?? RENDER_BUDGET_MS;
  const warn = options.warn ?? ((message: string) => console.warn(message));

  return (id, phase, actualDuration) => {
    if (isOverRenderBudget(actualDuration, budgetMs)) {
      warn(formatRenderBudgetWarning(id, phase, actualDuration, budgetMs));
    }
  };
}