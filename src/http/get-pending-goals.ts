export type PendingGoals = {
  id: string
  title: string
  desired_weekly_frequency: number
  completion_count: number
}

export async function getPendingGoals(): Promise<PendingGoals[]> {
  const response = await fetch('https://localhost:3333/api/v1/pending-goals')
  const data = await response.json()
  return data
}
