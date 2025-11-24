"use server"

import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

const getCachedTimes = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, times: true }
    })
    return user
  },
  ["times-clinic"],
  { revalidate: 60, tags: ["times-clinic"] }
)

export async function getTimesClinic({ userId }: { userId: string }) {
  if (!userId) {
    return { times: [], userId: "" }
  }

  try {
    const user = await getCachedTimes(userId)

    if (!user) {
      return { times: [], userId: "" }
    }

    return { times: user.times, userId: user.id }
  } catch (err) {
    console.log(err)
    return { times: [], userId: "" }
  }
}