
import { ProductFeedback } from './product-feedback.entity';



export const productFbProvider = [{
    provide:'PRODUCTFB_REPOSITORY',
    useValue :ProductFeedback
}
]
