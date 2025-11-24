"use client"

import { Button } from "@/components/ui/button"
import { Plan } from "@prisma/client"
import { createSubscription } from '../_actions/create-subscription'
import { toast } from 'sonner'

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {

  async function handleCreateBilling() {

    const { sessionId, error } = await createSubscription({ type: type as Plan })

    if (error) {
      toast.error(error)
      return;
    }

    if (sessionId) {
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
    }

  }


  return (
    <Button
      className={`w-full ${type === "BASIC" && "bg-blue-500 hover:bg-blue-400"} ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400"}`}
      onClick={handleCreateBilling}

    >
      Ativar assinatura
    </Button>
  )
}