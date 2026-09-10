import type { ActionState } from "@/lib/types";

export function FormAlert({ state }: { state?: ActionState }) {
  if (!state?.error && !state?.success) return null;

  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-danger-soft px-3 py-2 text-sm text-danger"
      >
        {state.error}
      </p>
    );
  }

  return (
    <p
      role="status"
      className="rounded-xl border border-emerald-200 bg-ok-soft px-3 py-2 text-sm text-ok"
    >
      {state.success}
    </p>
  );
}
