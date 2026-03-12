'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'

type Props = {
  label?: string
  className?: string
}

export function B2BNavLink({ label = 'B2B Портал', className = '' }: Props) {
  const { user } = useAuth()
  const href = user?.role === 'b2b_customer' ? '/b2b/portal' : '/b2b'

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}
