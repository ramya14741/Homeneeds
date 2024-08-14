import { Offer} from "./offer.entity";
export const offerProvider =[{
    provide:'OFFER_REPOSITORY',
    useValue:Offer,
}]