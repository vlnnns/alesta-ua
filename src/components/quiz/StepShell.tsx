'use client'

import { ReactNode } from 'react'

type StepShellProps = {
    header?: ReactNode
    footer?: ReactNode
    children: ReactNode
    className?: string
}

export default function StepShell({ header, footer, children, className }: StepShellProps) {
    return (
        <div
            className={`
        mx-auto w-full max-w-6xl
        h-full flex flex-col items-between justify-between
        rounded-2xl bg-white shadow-sm border border-neutral-200
        ${className || ''}
      `}
        >
            {/* header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur rounded-t-2xl">
                {header}
                <div className="h-px bg-neutral-200" />
            </div>

            {/* middle scrollable */}
            <div className="overflow-y-auto">{children}</div>

            {/* footer */}
            <div className="sticky bottom-0 z-10 bg-white/90 backdrop-blur rounded-b-2xl">
                <div className="h-px bg-neutral-200" />
                {footer}
            </div>
        </div>
    )
}
