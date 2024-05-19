const axios = require('axios');

const sendEmail = async () => {
  try {
    const response = await axios.post('https://api.resend.com/emails', {
      from: 'newreport.com', 
      to: 'raysellconcepcionpaulino@gmail.com',
      subject: 'Nuevo reporte creado',
      text: 'Se ha creado un nuevo reporte con el título: email send',
      html: '<p>Se ha creado un nuevo reporte con el título: <strong>email send</strong></p> <p>Descripción: Base URL\nThe Resend API is built on REST principles. We enforce HTTPS in every request to improve data security, integrity, and privacy. The API does not support HTTP.</p> <p>Fecha del incidente: 2024-05-27</p>'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY} `, // Replace with your actual API key
        'Content-Type': 'application/json'
      }
    });
    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response.data);
  }
};

sendEmail();
