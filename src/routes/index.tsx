import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/inbox' })
  }, [navigate])

  return null
}
