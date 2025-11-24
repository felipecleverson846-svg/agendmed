# Como usar os componentes do Chatbot

## 1. ChatWidget (Widget flutuante)

Adicione o componente no seu layout principal para exibir um widget flutuante de chat:

```tsx
// src/app/layout.tsx
import { ChatWidget } from '@/components/chatbot'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
```

## 2. WhatsAppButton (Botão para enviar via WhatsApp)

Use em qualquer página ou componente:

```tsx
import { WhatsAppButton } from '@/components/chatbot'

export default function Page() {
  return (
    <div>
      <WhatsAppButton 
        phoneNumber="5511999999999"
        message="Olá! Gostaria de agendar uma consulta."
      />
    </div>
  )
}
```

## 3. Variáveis de Ambiente

Configure no `.env.local`:

```env
# URL do chatbot (local ou Render)
NEXT_PUBLIC_CHATBOT_URL="http://localhost:3001"

# Número de WhatsApp da clínica
NEXT_PUBLIC_CLINIC_WHATSAPP="5511999999999"
```

## 4. Fluxo de Funcionamento

### Chat Widget:
1. Usuário clica no botão flutuante
2. Widget abre com histórico de conversa
3. Usuário digita mensagem
4. Mensagem é enviada para o chatbot
5. Chatbot responde
6. Resposta aparece no widget

### WhatsApp Button:
1. Usuário clica no botão
2. Mensagem é enviada via WhatsApp Web.js
3. Mensagem chega no WhatsApp da clínica
4. Clínica pode responder

## 5. Customização

### Mudar cores do ChatWidget:

```tsx
// Edite em src/components/chatbot/chat-widget.tsx
// Procure por "bg-emerald-500" e mude para sua cor preferida
```

### Mudar mensagem inicial:

```tsx
// Em chat-widget.tsx, linha ~80
{messages.length === 0 && (
  <div className="text-center text-gray-500 mt-8">
    <p className="text-sm">Sua mensagem aqui</p>
  </div>
)}
```

## 6. Deploy

### Vercel (aplicação principal):
- Já está configurado
- Adicione as variáveis de ambiente no painel da Vercel

### Render (chatbot):
- Faça push da pasta `chatbot/` para GitHub
- Crie um novo Web Service no Render
- Configure a URL do Render em `NEXT_PUBLIC_CHATBOT_URL`

## 7. Troubleshooting

**Erro: "Chatbot não está conectado"**
- Verifique se o chatbot está rodando
- Verifique a URL em `NEXT_PUBLIC_CHATBOT_URL`

**WhatsApp não envia mensagens:**
- Verifique se o WhatsApp Web.js está conectado
- Acesse `/api/whatsapp/status` para verificar status

**CORS error:**
- Verifique se o chatbot tem CORS habilitado
- Verifique a URL do chatbot
