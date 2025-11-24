"use client"
import { useState } from 'react'
import { ProfileFormData, useProfileForm } from './profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { updateProfile } from '../_actions/update-profile'
import { toast } from 'sonner'
import { formatPhone } from '@/utils/formatPhone'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AvatarProfile } from './profile-avatar'

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {

  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { update } = useSession();

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone
  });


  function generateTimeSlots(): string[] {
    const hours: string[] = [];

    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0")
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour}:${minute}`)
      }
    }

    return hours;

  }

  const hours = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort())
  }

  const brazilianTimeZones = [
    "America/Sao_Paulo",
    "America/Fortaleza",
    "America/Recife",
    "America/Bahia",
    "America/Belem",
    "America/Manaus",
    "America/Cuiaba",
    "America/Boa_Vista"
  ];
  
  const timeZones = Array.from(new Set(
    Intl.supportedValuesOf("timeZone").filter((zone: string) =>
      brazilianTimeZones.some(tz => zone === tz || zone.startsWith(tz + "/"))
    )
  )).sort();

  async function onSubmit(values: ProfileFormData) {
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      status: values.status === 'active' ? true : false,
      phone: values.phone,
      timeZone: values.timeZone,
      times: selectedHours || []
    })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.data)
  }

  async function handleLogout() {
    await signOut();
    await update();
    router.replace("/")
  }


  return (
    <div className='mx-auto w-full px-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className='text-3xl'>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex justify-center'>
                <AvatarProfile
                  avatarUrl={user.image}
                  userId={user.id}
                />
              </div>

              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Digite o nome da clinica...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Digite o endereço da clinica...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='(67) 99912-3456'
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value)
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Status da clinica
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Selecione o status da clincia" />
                          </SelectTrigger>
                          <SelectContent className='z-50 bg-white text-black'>
                            <SelectItem value="active" className='bg-white text-black hover:bg-gray-100'>ATIVO (clinica aberta)</SelectItem>
                            <SelectItem value="inactive" className='bg-white text-black hover:bg-gray-100'>INATIVO (clinica fechada)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-2'>
                  <Label className='font-semibold'>
                    Configurar horários da clinica
                  </Label>

                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen} >
                    <DialogTrigger asChild>
                      <Button variant="outline" className='w-full justify-between'>
                        Clique aqui para selecionar horários
                        <ArrowRight className='w-5 h-5' />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className='bg-white text-black'>
                      <DialogHeader>
                        <DialogTitle className='text-black'>Horários da clinica</DialogTitle>
                        <DialogDescription className='text-gray-600'>
                          Selecione abaixo os horários de funcionamento da clinica:
                        </DialogDescription>
                      </DialogHeader>

                      <section className='py-4'>
                        <p className='text-sm text-gray-700 mb-2'>
                          Clique nos horários abaixo para marcar ou desmcar:
                        </p>

                        <div className='grid grid-cols-5 gap-2'>
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant="outline"
                              className={cn('h-10', selectedHours.includes(hour) && 'border-2 border-emerald-500 text-primary')}
                              onClick={() => toggleHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>

                      </section >

                      <Button
                        className='w-full bg-gray-400! hover:bg-gray-500! text-white!'
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>

                    </DialogContent>
                  </Dialog>

                </div>


                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Selecione o seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent className='z-50 bg-white text-black'>
                            {timeZones.map((zone) => (
                              <SelectItem key={zone} value={zone} className='bg-white text-black hover:bg-gray-100'>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className='w-full bg-emerald-500 hover:bg-emerald-400'
                >
                  Salvar alterações
                </Button>

              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <section className='mt-4'>
        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Sair da conta
        </Button>
      </section>
    </div>
  )
}