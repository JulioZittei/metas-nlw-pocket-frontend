import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'

dayjs.locale(ptBR)

type GoalsPerDay = Record<
  string,
  {
    id: string
    title: string
    completed_at: string
  }[]
>

type WeekSummary = {
  completed: number
  total: number
  goals_per_day: GoalsPerDay
}

export async function getSummary(): Promise<WeekSummary> {
  const response = await fetch('https://localhost:3333/api/v1/summary')
  const data = await response.json()
  return parseToDate(data)
}

function parseToDate(summary: WeekSummary): WeekSummary {
  const groupedGoals: GoalsPerDay = {}

  for (const date in summary.goals_per_day) {
    const dateFormatted = dayjs(date).format('YYYY-MM-DD')

    if (!groupedGoals[dateFormatted]) {
      groupedGoals[dateFormatted] = []
    }

    groupedGoals[dateFormatted] = groupedGoals[dateFormatted].concat(
      summary.goals_per_day[date]
    )
  }
  summary.goals_per_day = groupedGoals
  return summary
}
