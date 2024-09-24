export type Goal = {
  id: string
  title: string
  desired_weekly_frequency: number
  created_at: Date
  updated_at: Date
}

export async function createGoalCompletion(goalId: string): Promise<Goal> {
  const response = await fetch('https://localhost:3333/api/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goal_id: goalId,
    }),
  })
  const data = await response.json()
  return data
}
