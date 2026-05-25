class GmailGateWay {
  
  constructor() {
    this._emailsCC = `administrativo@multbovinos.com.br`
    this._nome = 'MultSoft Desenvolvimento de Sistemas'
  }

  send(emailPayload) {
    
    
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
        message: "FINALIZADO"
      };
      
    } catch(error) {
      return {
        success: false,
        message: 'FALHA'
      }
    }

  }

}