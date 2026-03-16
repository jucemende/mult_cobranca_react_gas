class GmailGateWay {
  
  constructor() {
    this._emailsCC = `administrativo@multbovinos.com.br`
    this._nome = 'MultSoft Desenvolvimento de Sistemas'
  }

  send(emailPayload) {
    
    return `Enviando email: ${emailPayload.to}`
    
    const cotaRestante = MailApp.getRemainingDailyQuota();

    if (cotaRestante <= 10) {
      throw new Error('Limite de envios diários próximo do limite permitido');
    }

    try {

      GmailApp.sendEmail(
        emailPayload.to,
        emailPayload.subject,
        "",
          {
            htmlBody: emailPayload.html,
            name: this._nome,
            cc: this._emailsCC
          }
      )

      return {
        success: true,
        message: "finalizado"
      };
      
    } catch(error) {
      return {
        success: false,
        message: 'naoEncontrado'
      }
    }

  }

}