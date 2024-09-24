export type Goal = {
  id: string
  title: string
  desired_weekly_frequency: number
  created_at: Date
  updated_at: Date
}

export async function createGoal(goal: {
  title: string
  desiredWeeklyFrequency: number
}): Promise<Goal> {
  const response = await fetch('https://localhost:3333/api/v1/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: goal.title,
      desired_weekly_frequency: goal.desiredWeeklyFrequency,
    }),
  })
  const data = await response.json()
  return data
}
