import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RENDER_BUDGET_MS,
  createRenderBudgetCallback,
  formatRenderBudgetWarning,
  isOverRenderBudget,
  isRenderBudgetMonitoringEnabled,
} from '../src/lib/observability/render-budget';

// The callback only reads (id, phase, actualDuration); the remaining Profiler
// arguments are irrelevant to the budget check.
function render(
  callback: ReturnType<typeof createRenderBudgetCallback>,
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
) {
  callback(id, phase, actualDuration, actualDuration, 0, 0);
}

test('Render budget monitor — Profiler threshold checks', async (t) => {
  await t.test('budget is one 60fps frame (16.6ms)', () => {
    assert.equal(RENDER_BUDGET_MS, 16.6);
  });

  await t.test('isOverRenderBudget is strictly greater-than', () => {
    assert.equal(isOverRenderBudget(16.7), true);
    assert.equal(isOverRenderBudget(16.6), false);
    assert.equal(isOverRenderBudget(5), false);
    assert.equal(isOverRenderBudget(0), false);
  });

  await t.test('isOverRenderBudget ignores non-finite durations', () => {
    assert.equal(isOverRenderBudget(Number.NaN), false);
    assert.equal(isOverRenderBudget(Number.POSITIVE_INFINITY), false);
  });

  await t.test('onRender callback warns when the budget is exceeded', () => {
    const warnings: string[] = [];
    const onRender = createRenderBudgetCallback({ warn: (m) => warnings.push(m) });

    render(onRender, 'TaskList', 'update', 25.4);

    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /TaskList/);
    assert.match(warnings[0], /update/);
    assert.match(warnings[0], /25\.4ms/);
  });

  await t.test('onRender callback stays silent at or under the budget', () => {
    const warnings: string[] = [];
    const onRender = createRenderBudgetCallback({ warn: (m) => warnings.push(m) });

    render(onRender, 'TaskList', 'mount', 16.6);
    render(onRender, 'TaskList', 'mount', 3);

    assert.equal(warnings.length, 0);
  });

  await t.test('custom budgets override the default', () => {
    const warnings: string[] = [];
    const onRender = createRenderBudgetCallback({
      budgetMs: 50,
      warn: (m) => warnings.push(m),
    });

    render(onRender, 'Heavy', 'update', 30);
    assert.equal(warnings.length, 0);

    render(onRender, 'Heavy', 'update', 51);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /budget 50ms/);
  });

  await t.test('warning message includes id, phase, duration and budget', () => {
    assert.equal(
      formatRenderBudgetWarning('Board', 'mount', 20, 16.6),
      '[RenderBudgetMonitor] "Board" mount took 20.0ms (budget 16.6ms)',
    );
  });

  await t.test('monitoring is excluded from production builds', () => {
    assert.equal(isRenderBudgetMonitoringEnabled('production'), false);
    assert.equal(isRenderBudgetMonitoringEnabled('development'), true);
    assert.equal(isRenderBudgetMonitoringEnabled('test'), true);
  });
});