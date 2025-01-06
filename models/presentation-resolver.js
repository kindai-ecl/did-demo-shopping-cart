// import { Resolver } from 'did-resolver'
// import { getResolver } from 'web-did-resolver'
// import { verifyCredential, verifyPresentation } from 'did-jwt-vc'
const { Resolver } = require('did-resolver');
const { getResolver } = require('web-did-resolver');
const { verifyCredential, verifyPresentation } = require('did-jwt-vc');

// module.exports = async function didResolver() {
// }
const resolver = new Resolver(getResolver())

async function verifiedVC(vcJwt) {
    return await verifyCredential(vcJwt, resolver)
}

async function verifiedVP(vpJwt) {
    return await verifyPresentation(vpJwt, resolver)
}

module.exports = {
    verifiedVC,
    verifiedVP
}