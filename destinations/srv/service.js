const cds = require('@sap/cds');
const axios=require('axios');

module.exports = (srv) => {

  srv.on('getDistricts', async (req) => {

    const stateName = req.data.state;

    if (!stateName) {
      return [{ name: "Please provide state name" }];
    }

    try {

      //  Connect to external service
      const api = await cds.connect.to('DESTNATIONS');

      const response = await api.send({
        method: 'POST',
        path: '/api/v0.1/countries/state/cities',
        data: {
          country: "India",
          state: stateName
        }
      });

      const districts = response.data.map(name => ({
        name: name
      }));

      return districts;

    } catch (error) {
      console.error("API ERROR:", error.message);
      return [{ name: "Error fetching data" }];
    }

  });

};