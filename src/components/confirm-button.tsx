"use client";

import type { ReactNode } from "react";

/* 서버 액션 form 안에서 쓰는 확인창 달린 제출 버튼 (삭제 등 되돌리기 어려운 액션용) */
export function ConfirmButton({
  message,
  className = "",
  children,
}: {
  message: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className={`unstyled ${className}`}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
