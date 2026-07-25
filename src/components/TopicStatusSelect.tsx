"use client";

const STATUS_OPTIONS = [
  { v: "NOT_STARTED", l: "Not Started" },
  { v: "IN_PROGRESS", l: "In Progress" },
  { v: "COMPLETED", l: "Completed" },
  { v: "REVISED", l: "Revised" },
];

export default function TopicStatusSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="status"
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="input w-auto text-xs py-1"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.v} value={o.v}>{o.l}</option>
      ))}
    </select>
  );
}
