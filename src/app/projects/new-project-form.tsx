"use client";

import { useState } from "react";
import { FieldLabel } from "@/components/ui";

type AreaOpt = { id: number; name: string; icon: string | null };
type GoalOpt = { id: number; title: string; areaId: number | null };

/* 새 프로젝트 입력 폼 — 영역을 고르면 연결 목표 드롭다운이 그 영역의 목표만 보여준다.
   PC 기준: 1행 = 제목 + 영역·연결 목표, 2행 = 프로젝트 이름·시작일·종료일 */
export function NewProjectForm({
  areas,
  goals,
  action,
}: {
  areas: AreaOpt[];
  goals: GoalOpt[];
  action: (fd: FormData) => Promise<void>;
}) {
  const [areaId, setAreaId] = useState("");
  const filteredGoals = areaId
    ? goals.filter((g) => String(g.areaId) === areaId)
    : goals;

  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-sm font-semibold text-neutral-500">새 프로젝트</h2>
        <label className="flex items-center gap-1.5">
          <span className="text-xs text-neutral-400">영역</span>
          <select name="areaId" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            <option value="">영역 없음</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <span className="text-xs text-neutral-400">연결 목표</span>
          {/* 영역이 바뀌면 key로 리셋해 다른 영역 목표가 남아있지 않게 한다 */}
          <select name="goalId" key={areaId} defaultValue="">
            <option value="">연결 목표 없음</option>
            {filteredGoals.map((g) => (
              <option key={g.id} value={g.id}>🎯 {g.title}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-52 flex-1">
          <FieldLabel>프로젝트 이름</FieldLabel>
          <input name="title" placeholder="프로젝트 (예: 해외 시장 진출)" required className="w-full" />
        </label>
        <label>
          <FieldLabel>시작일</FieldLabel>
          <input type="date" name="startDate" />
        </label>
        <span className="pb-2 text-neutral-300">~</span>
        <label>
          <FieldLabel>종료일</FieldLabel>
          <input type="date" name="endDate" />
        </label>
        <button type="submit">추가</button>
      </div>
    </form>
  );
}
