'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'

type Props = {
  label?: string
  className?: string
  accent?: boolean
}

export function EngineersNavLink({ label = 'Биржа Инженеров', className = '', accent = true }: Props) {
  const { user } = useAuth()
  const href = user?.role === 'engineer' ? '/engineers/portal' : '/engineers'

  return (
    <Link
      href={href}
      className={className}
    >
      {accent && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />}
      {label}
    </Link>
  )
}
