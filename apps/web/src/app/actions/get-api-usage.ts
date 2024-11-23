"use server"
import { auth } from '@clerk/nextjs/server'
import { Unkey } from '@unkey/api'
import { env } from '@/env'

const unkey = new Unkey({ token: env.UNKEY_TOKEN })

export interface DailyUsage {
  name: string
  requests: number
  date: string
}

export async function getApiUsage(): Promise<DailyUsage[]> {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // Calculate date range for past week
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    // Get verifications data
    const { result: verifications } = await unkey.keys.getVerifications({
      ownerId: userId,
      start: startDate.getTime(), // Unix timestamp in ms
      end: endDate.getTime(),
      granularity: 'day'
    })

    if (!verifications?.verifications?.length) {
      return generateEmptyWeekData()
    }

    // Process verifications into daily data
    return verifications.verifications.map((day) => ({
      name: formatDayName(new Date(day.time)),
      requests: day.success,
      date: new Date(day.time).toISOString(),
    }))

  } catch (error) {
    console.error('Error fetching API usage:', error)
    return generateEmptyWeekData()
  }
}

function generateEmptyWeekData(): DailyUsage[] {
  const data: DailyUsage[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    data.push({
      name: formatDayName(date),
      requests: 0,
      date: date.toISOString(),
    })
  }

  return data
}

function formatDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
