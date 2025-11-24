import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return Response.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    const services = await prisma.service.findMany({
      where: {
        userId: userId,
        status: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
      },
    })

    return Response.json(services, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[Services Public API] Erro ao buscar serviços:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
