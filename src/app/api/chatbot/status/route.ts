export async function GET() {
  try {
    const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:3001'
    
    console.log(`[Chatbot API] Conectando em: ${chatbotUrl}/api/whatsapp/status`)
    
    const response = await fetch(`${chatbotUrl}/api/whatsapp/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(`[Chatbot API] Status da resposta: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Chatbot API] Erro: ${errorText}`)
      throw new Error(`Chatbot responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Chatbot API] Dados recebidos:`, data)
    
    return Response.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[Chatbot API] Erro ao conectar com chatbot:', error)
    
    return Response.json(
      { 
        connected: false, 
        status: 'Desconectado',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 200 }
    )
  }
}
