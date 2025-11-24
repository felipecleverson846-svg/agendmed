import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { GridPlans } from './_components/grid-plans'
import { getSubscription } from '@/utils/get-subscription'
import { SubscriptionDetail } from './_components/subscription-detail'

export default async function Plans() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const subscritpion = await getSubscription({ userId: session?.user?.id! })

  return (
    <div className='mx-auto w-full px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Planos</h1>
        <p className='text-gray-600'>Escolha o melhor plano para sua clínica</p>
      </div>

      {subscritpion?.status !== "active" && (
        <GridPlans />
      )}

      {subscritpion?.status === "active" && (
        <SubscriptionDetail subscription={subscritpion!} />
      )}

    </div>
  )
}