function TestSendCobrancasUseCase() {
  const service = new SendChargeUseCase()
  const dataBulk = [
    {teste: 1},
    {teste: 2},
    {teste: 3}
  ]

  const data = {teste: 4}

  console.log( service.send({ data: dataBulk, bulk: true }) )

}
  

class SendChargeUseCase extends CobrancasUseCase {

  constructor() {
    super({ cobrancasRepository: new SheetsCobrancasRepository() })
    this._geteWay = new GmailGateWay()
  }

  send({ data, bulk = false }) {
    
    const canais = getEnunsCobranca().canais
 
    if (bulk) {
      return data.map(item => this.send({data: item, bulk: false}))
    }

    switch (data.canal) {
      case canais.WHATSAPP:
        return this._whatsAppBuilder(data)
      
      case canais.EMAIL:
        const payload = this._emailBuilder(data)
        return this._geteWay.send(payload)

      default:
        throw new Error(`Canal '${canal}' não suportado`);
    }
  }

  _emailBuilder(data){
    
    const { cliente, email, view } = data
    const { regua, faturas } = view
    const reguaPrinpital = this.boots.regua()[regua.reguaId]
    
    const corpoEmail = (content = {}) => {
      
      return `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f1f1; padding:20px 0;">
        <tr>
          <td align="center">
            <table width="700" cellpadding="0" cellspacing="0" style="background-color:#ffffff; font-family: Arial, Helvetica, sans-serif;">
              
              <!-- HEADER -->
              <tr>
                <td style="background-color:#567751; padding:20px;">
                  <h3 style="color:#ffffff; text-align:center; margin:0; font-weight:normal;">
                    ${content.titleMensagem}
                  </h3>
                </td>
              </tr>

              <!-- CONTEÚDO -->
              <tr>
                <td style="padding:20px; color:#333333; font-size:14px; line-height:1.6;">
                  <p>Prezado(a) Cliente <b>${content.cliente}</b>,</p>

                  <p>Esperamos que esteja tudo bem com você.</p>

                  <!-- MENSAGEM PRINCIPAL -->
                  <p style="text-align:justify;">
                    ${content.msgPrincipal}
                  </p>

                  <!-- TABELA FATURAS -->
                  <p><b>Os detalhes do débito são os seguintes:</b></p>

                  <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-top:10px;">
                    
                    <!-- TITULOS TABELA -->
                    <thead>
                      <tr style="background-color:#eeeeee;">
                        ${content.titleTable}
                      </tr>
                    </thead>

                    <!-- BODY TABELA -->
                    <tbody>
                      ${content.bodyTable}
                    </tbody>
                  </table><br>

                  <!-- MENSAGEM SEGUNDÁRIA -->
                  <p>Caso o pagamento já tenha sido efetuado, por favor, desconsidere esta mensagem.</p>
                  <p>
                      Em caso de dúvida ou necessidade de assistência, estamos à disposição.
                      Entre em contato com o setor financeiro pelo e-mail: <b>administrativo@multbovinos.com.br</b>
                      ou pelo WhatsApp <b>62 98100-4205 | (62) 98154-0112</b>
                  </p>
                  <p>Agradecemos pela atenção e parceria!</p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color:#567751; padding:15px; text-align:center; color:#ffffff; font-size:12px;">
                  <p style="margin:0;">Rua 89, Nº 225, Qd F 44, Lt 25, St. Sul</p>
                  <p style="margin:0;">Goiânia - GO | CEP 74.093-140</p>
                  <p style="margin:0;">multsoft.agr.br | (61) 3686-2600</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
      `
    }

    const linhas = faturas.map(f => `
      <tr>
        <td>${new Date(f.vencimento).toLocaleDateString('pt-BR')}</td>
        <td>${f.vlrLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        <td>${f.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </td>
      </tr>
    `).join('')

    return {
      to: email,
      subject: reguaPrinpital.titulo,
      html: corpoEmail({
        titleMensagem: reguaPrinpital.titulo,
        cliente: cliente,
        msgPrincipal: reguaPrinpital.mensagemPadrao.replace(/(\r\n|\n|\r)/g, '<br>'),
        titleTable: `
          <th style="text-align: left;">Vencimento</th>
          <th style="text-align: left;">Valor</th>
          <th style="text-align: left;">Total</th>
        `,
        bodyTable: linhas,
      }),
      meta: {
        reguaId: reguaPrinpital.id,
        canal: 'Email'
      }
    }

  }

  _whatsAppBuilder(data) {

    const { cliente, telefone, view } = data
    const { regua, faturas } = view
    const reguaPrinpital = this.boots.regua()[regua.reguaId]

    const mensagemLimpa = reguaPrinpital.mensagemPadrao
      .replace(/<b>(.*?)<\/b>/gi, '*$1*')   // converte <b> para *
      .replace(/<br\s*\/?>/gi, '\n')        // converte <br> para quebra de linha
      .replace(/<\/?[^>]+(>|$)/g, '');

    const linhasFaturas = faturas.map(f => {

      const vencimento = new Date(f.vencimento)
        .toLocaleDateString('pt-BR');

      const valor = f.vlrLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      const total = f.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      
      return `> Venc: ${vencimento} | Valor: ${valor} | *Total: ${total}*`

    }).join('\n');

    const mensagem = [
      `Prezado(a) Cliente *${cliente}*,`,
      '',
      mensagemLimpa,
      '',
      '*Detalhes do débito:*',
      linhasFaturas,
      '',
      'Caso o pagamento já tenha sido efetuado, por favor, desconsidere esta mensagem.',
      '',
      'Em caso de dúvida, estamos à disposição.',
      'administrativo@multbovinos.com.br',
      '62 98100-4205 | 62 98154-0112',
      '',
      'MultSoft Desenvolvimento de Sistemas'
    ].join('\n');

    const telefoneLimpo = String(telefone ?? '')
    .replace(/\D/g, '')

    const linkWhatsWeb = `https://web.whatsapp.com/send?phone=${telefoneLimpo}&text=${encodeURIComponent(mensagem)}`;
    
    return {
      to: telefoneLimpo,
      message: mensagem,
      link: linkWhatsWeb,
      meta: {
        reguaId: reguaPrinpital.id,
        canal: 'WhatsApp'
      }
    };
  }

}