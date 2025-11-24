import getSesion from '@/lib/getSession'

export async function POST(request: Request) {
  try {
    const session = await getSesion()

    if (!session?.user?.id) {
      return Response.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return Response.json(
        { error: 'phoneNumber é obrigatório' },
        { status: 400 }
      )
    }

    const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:3001'

    const response = await fetch(`${chatbotUrl}/api/whatsapp/register-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        userId: session.user.id,
      }),
    })

    const data = await response.json()

    return Response.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[Register User API] Erro:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
