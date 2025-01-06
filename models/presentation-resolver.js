import { Resolver } from 'did-resolver'
import { getResolver } from 'web-did-resolver'
import { verifyCredential, verifyPresentation } from 'did-jwt-vc'

const resolver = new Resolver(getResolver())
const verifiedVC = await verifyCredential(vcJwt, resolver)
console.log(verifiedVC)

const verifiedVP = await verifyPresentation(vpJwt, resolver)
console.log(verifiedVP)