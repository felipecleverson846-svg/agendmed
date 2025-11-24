import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, serviceId, userId, appointmentDate, time } = body

    // Validar campos obrigatórios
    if (!name || !phone || !serviceId || !userId || !appointmentDate || !time) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se o serviço existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email: `${phone}@chatbot.local`, // Email fictício baseado no telefone
        phone,
        serviceId,
        userId,
        appointmentDate: new Date(appointmentDate),
        time
      }
    })

    return NextResponse.json(
      {
        id: appointment.id,
        message: 'Agendamento salvo com sucesso'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Save Appointment API] Erro:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao salvar agendamento' },
      { status: 500 }
    )
  }
}
