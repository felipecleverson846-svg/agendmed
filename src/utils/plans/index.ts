
export type PlanDetailsProps = {
  maxServices: number;
}

export type PlansProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
}

export const PLANS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50
  }
}


export const subscriptionPlans = [
  {
    id: "BASIC",
    name: "Basic",
    description: "Perfeito para clínicas iniciantes",
    oldPrice: "R$ 127,90",
    price: "R$ 57,90",
    features: [
      `Até ${PLANS["BASIC"].maxServices} serviços cadastrados`,
      'Agendamentos ilimitados',
      'Suporte por email',
      'Relatórios básicos',
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Ideal para clínicas em expansão",
    oldPrice: "R$ 227,90",
    price: "R$ 127,90",
    features: [
      `Até ${PLANS["PROFESSIONAL"].maxServices} serviços cadastrados`,
      'Agendamentos ilimitados',
      'Suporte prioritário 24/7',
      'Relatórios avançados e personalizados',
    ]
  }
]