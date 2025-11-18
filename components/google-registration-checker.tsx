'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function GoogleRegistrationChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      const user = session.user as any

      // Nếu user đăng nhập bằng Google nhưng chưa hoàn tất đăng ký
      if (user.isGoogleRegistrationComplete === false) {
        router.push(`/auth/complete-registration?email=${encodeURIComponent(user.email || '')}&name=${encodeURIComponent(user.name || '')}`)
      }
    }
  }, [session, status, router])

  return <>{children}</>
}
