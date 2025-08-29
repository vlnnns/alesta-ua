// components/blog/ConfirmDeleteButton.tsx
'use client'

export default function ConfirmDeleteButton({ label = 'Видалити' }: { label?: string }) {
    return (
        <button
            type="button"
            className="rounded-lg border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50"
            onClick={(e) => {
                const form = (e.currentTarget as HTMLButtonElement).closest('form') as HTMLFormElement | null
                if (form && confirm('Видалити пост?')) form.requestSubmit()
            }}
        >
            {label}
        </button>
    )
}
