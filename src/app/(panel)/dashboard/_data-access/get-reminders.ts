"use server"

import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

const getCachedReminders = unstable_cache(
  async (userId: string) => {
    return await prisma.reminder.findMany({
      where: { userId }
    })
  },
  ["reminders"],
  { revalidate: 60, tags: ["reminders"] }
)

export async function getReminders({ userId }: { userId: string }) {
  if (!userId) return []

  try {
    return await getCachedReminders(userId)
  } catch (err) {
    console.log(err)
    return []
  }
}