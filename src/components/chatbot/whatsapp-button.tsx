"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export function WhatsAppButton({
  phoneNumber = process.env.NEXT_PUBLIC_CLINIC_WHATSAPP,
  message = 'Olá! Gostaria de agendar uma consulta.',
  className = ''
}: WhatsAppButtonProps) {
  const [loading, setLoading] = useState(false)
  const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:3001'

  const handleSendWhatsApp = async () => {
    if (!phoneNumber) {
      toast.error('Número de WhatsApp não configurado')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${chatbotUrl}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          message
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Mensagem enviada via WhatsApp!')
      } else {
        toast.error(data.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSendWhatsApp}
      disabled={loading}
      className={`bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 ${className}`}
    >
      <MessageCircle size={18} />
      {loading ? 'Enviando...' : 'Enviar via WhatsApp'}
    </Button>
  )
}
