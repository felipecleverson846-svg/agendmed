import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointments-list";
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/formatCurrency'

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null;
}

export function DialogAppointment({ appointment }: DialogAppointmentProps) {
  return (
    <DialogContent className='bg-white text-black'>
      <DialogHeader>
        <DialogTitle className='text-black'>
          Detalhes do agendamento
        </DialogTitle>
        <DialogDescription className='text-gray-600'>
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-3">

        {appointment && (
          <article className='space-y-2'>
            <p className='text-gray-800'><span className="font-semibold">Horario agendado:</span> {appointment.time}</p>
            <p className="text-gray-800"><span className="font-semibold">
              Data do agendamento:</span> {new Intl.DateTimeFormat('pt-BR', {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(appointment.appointmentDate))}
            </p>
            <p className='text-gray-800'><span className="font-semibold">Nome:</span> {appointment.name}</p>
            <p className='text-gray-800'><span className="font-semibold">Telefone:</span> {appointment.phone}</p>
            <p className='text-gray-800'><span className="font-semibold">Email:</span> {appointment.email}</p>

            <section className="bg-emerald-50 mt-4 p-3 rounded-md border border-emerald-200">
              <p className='text-gray-800'><span className="font-semibold">Serviço:</span> {appointment.service.name}</p>
              <p className='text-gray-800'><span className="font-semibold">Valor:</span> {formatCurrency((appointment.service.price / 100))}</p>
            </section>

          </article>
        )}


      </div>

    </DialogContent>
  )
}