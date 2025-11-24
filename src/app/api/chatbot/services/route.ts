import { prisma } from '@/lib/prisma'
import getSesion from '@/lib/getSession'

export async function GET() {
  try {
    const session = await getSesion()

    if (!session?.user?.id) {
      return Response.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const services = await prisma.service.findMany({
      where: {
        userId: session.user.id,
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
    console.error('[Services API] Erro ao buscar serviços:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
