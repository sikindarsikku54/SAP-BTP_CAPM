const cds = require('@sap/cds');
const axios = require('axios');
const https = require('https');
const forge = require('node-forge');

module.exports = cds.service.impl(async function () {

  this.on('getSecret', async () => {
    try {

      const vcap = JSON.parse(process.env.VCAP_SERVICES || '{}');
      const svc = vcap['credstore']?.[0];

      if (!svc) return 'Service not bound';

      const c = svc.credentials;

      const httpsAgent = new https.Agent({
        cert: c.certificate,
        key: c.key,
        rejectUnauthorized: true
      });

      // 🔐 Encrypt value using server public key
      const publicKey = forge.pki.publicKeyFromPem(c.encryption.server_public_key);
      const encryptedValue = forge.util.encode64(
        publicKey.encrypt("123456")
      );

      // ✅ STORE SECRET
      await axios.put(
        `${c.url}/passwords`,
        {
          name: "db-password",
          value: encryptedValue
        },
        {
          httpsAgent,
          headers: {
            'Content-Type': 'application/json',
            'sapcp-credstore-namespace': 'my-app'
          }
        }
      );

      // ✅ GET SECRET (still encrypted)
      const res = await axios.get(
        `${c.url}/passwords/db-password`,
        {
          httpsAgent,
          headers: {
            'sapcp-credstore-namespace': 'my-app'
          }
        }
      );

      // 🔓 Decrypt using private key
      const privateKey = forge.pki.privateKeyFromPem(c.encryption.client_private_key);
      const decrypted = privateKey.decrypt(
        forge.util.decode64(res.data.value)
      );

      return `Your secret is: ${decrypted}`;

    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err.message);
      return `Error: ${err.message}`;
    }
  });

});