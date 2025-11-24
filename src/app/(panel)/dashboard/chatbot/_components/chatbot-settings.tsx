"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface WhatsAppStatus {
  connected: boolean
  status: string
}

export function ChatbotSettings() {
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  // Verificar status do WhatsApp
  const checkStatus = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/chatbot/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data && typeof data === 'object') {
        setWhatsappStatus(data)
      } else {
        throw new Error('Resposta inválida do servidor')
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      toast.error('Erro ao conectar com o chatbot. Verifique se o servidor está rodando.')
      setWhatsappStatus({ connected: false, status: 'Desconectado' })
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Verificar status a cada 10 segundos
    const interval = setInterval(checkStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    try {
      const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:3001'
      // Abrir nova aba com o QR code
      window.open(`${chatbotUrl}/api/whatsapp/qr`, '_blank')
      toast.success('Abra a nova aba e escaneie o QR code com seu WhatsApp')
      
      // Verificar status após 5 segundos
      setTimeout(() => {
        checkStatus()
      }, 5000)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao conectar')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/chatbot/disconnect', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('WhatsApp desconectado')
        setWhatsappStatus({ connected: false, status: 'Desconectado' })
      } else {
        toast.error(data.error || 'Erro ao desconectar')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao desconectar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Status do WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>Status do WhatsApp</CardTitle>
          <CardDescription>
            Verifique a conexão do seu WhatsApp com o chatbot
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {checking ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span>Verificando status...</span>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 border rounded-lg'>
                <div className='flex items-center gap-3'>
                  {whatsappStatus?.connected ? (
                    <>
                      <CheckCircle className='w-6 h-6 text-green-500' />
                      <div>
                        <p className='font-semibold text-green-700'>Conectado</p>
                        <p className='text-sm text-gray-600'>WhatsApp pronto para enviar mensagens</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className='w-6 h-6 text-red-500' />
                      <div>
                        <p className='font-semibold text-red-700'>Desconectado</p>
                        <p className='text-sm text-gray-600'>Conecte seu WhatsApp para começar</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className='flex gap-2'>
                {whatsappStatus?.connected ? (
                  <Button
                    onClick={handleDisconnect}
                    disabled={loading}
                    variant='destructive'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Desconectando...
                      </>
                    ) : (
                      'Desconectar'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={loading}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Conectando...
                      </>
                    ) : (
                      'Conectar WhatsApp'
                    )}
                  </Button>
                )}

                <Button
                  onClick={checkStatus}
                  disabled={checking}
                  variant='outline'
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Atualizar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como conectar</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ol className='space-y-3 list-decimal list-inside'>
            <li className='text-sm'>
              Clique em <strong>"Conectar WhatsApp"</strong>
            </li>
            <li className='text-sm'>
              Uma nova aba será aberta com um <strong>QR code</strong>
            </li>
            <li className='text-sm'>
              Abra <strong>WhatsApp no seu celular</strong>
            </li>
            <li className='text-sm'>
              Vá em <strong>Configurações → Dispositivos Conectados → Conectar um dispositivo</strong>
            </li>
            <li className='text-sm'>
              <strong>Escaneie o QR code</strong> com a câmera do seu celular
            </li>
            <li className='text-sm'>
              Pronto! O status mudará para <strong>"Conectado"</strong>
            </li>
          </ol>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4'>
            <p className='text-sm text-blue-800'>
              <strong>💡 Dica:</strong> Mantenha o WhatsApp Web conectado no navegador do servidor para que o chatbot funcione corretamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades do Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2 text-sm'>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>Responder mensagens automaticamente</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>Agendar consultas via WhatsApp</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>Enviar confirmações de agendamento</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <span>Responder perguntas sobre planos e serviços</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
