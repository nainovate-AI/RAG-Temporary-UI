import { redirect } from 'next/navigation'

export default function DashboardsPage() {
  // Redirect to inferencer dashboard by default
  redirect('/dashboards/inferencer')
}