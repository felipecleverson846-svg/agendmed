
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { subscriptionPlans } from '@/utils/plans/index'
import { SubscriptionButton } from './subscription-button'

export function GridPlans() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
      {subscriptionPlans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`flex flex-col w-full h-full transition-all hover:shadow-lg ${index === 0 && "border-2 border-blue-500"} ${index === 1 && "border-2 border-emerald-500 shadow-lg"}`}
        >
          {index === 0 && (
            <div className='bg-blue-500 w-full py-3 text-center rounded-t-xl'>
              <p className='font-semibold text-white'>PROMOÇÃO EXCLUSIVA</p>
            </div>
          )}
          {index === 1 && (
            <div className='bg-emerald-500 w-full py-3 text-center rounded-t-xl'>
              <p className='font-semibold text-white'>PROMOÇÃO EXCLUSIVA</p>
            </div>
          )}

          <CardHeader>
            <CardTitle className='text-xl md:text-2xl'>
              {plan.name}
            </CardTitle>
            <CardDescription>
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className='flex-grow'>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index} className='text-sm md:text-base'>
                  {feature}
                </li>
              ))}
            </ul>

            <div className='mt-4'>
              <p className='text-gray-600 line-through'>{plan.oldPrice}</p>
              <p className='text-black text-2xl font-bold'>{plan.price}</p>
            </div>

          </CardContent>
          <CardFooter>
            <SubscriptionButton
              type={plan.id as any}
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}