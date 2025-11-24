import getSesion from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { ChatbotSettings } from './_components/chatbot-settings'

export default async function ChatbotPage() {
  const session = await getSesion()

  if (!session) {
    redirect("/")
  }

  return (
    <main className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Configurações do Chatbot</h1>
        <p className='text-gray-600 mt-2'>Gerencie a conexão do seu WhatsApp com o chatbot</p>
      </div>

      <ChatbotSettings />
    </main>
  )
}
