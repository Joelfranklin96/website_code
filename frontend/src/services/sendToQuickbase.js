// quickbaseService.js
const axios = require('axios');

export async function sendToQuickbase(formData) {
  const quickbaseApiUrl = 'https://api.quickbase.com/v1/records'; // Example URL
  const dbId = 'bt4pdu58q';
  const userToken = 'b9eeff_qzes_0_pumaxgdw8bacbd9z6cwmcsu8j6w';

  try {
    const response = await axios({
      method: 'post',
      url: quickbaseApiUrl,
      headers: {
        'QB-Realm-Hostname': 'emerjence.quickbase.com',
        'User-Agent': 'YourAppName/1.0',
        'Authorization': `QB-USER-TOKEN ${userToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        "to": dbId,
        "data": [{
          "6": { "value": formData.name },
          "7": { "value": formData.email },
          "8": { "value": formData.message }
        }]
      }
    });
    console.log('Record added:', response.data);
  } catch (error) {
    console.error('Error sending to Quickbase:', error);
  }
}
