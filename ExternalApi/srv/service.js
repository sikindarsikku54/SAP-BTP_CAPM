const cds =require('@sap/cds');

module.exports = cds.service.impl (async function (){

    const s4=await cds.connect.to('API_BILLING_DOCUMENT_SRV')
    this.on('*',async(req)=>{
        if(req.target?.['@cds.persistence.skip']){
            return s4.run(req.query);
        }
    })
})