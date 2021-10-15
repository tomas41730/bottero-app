//import storage from '../firebase'
import firebase from 'firebase/app'
import 'firebase/storage'
import { addProduct } from '../firestore/FirebaseProducts'
export async function onUpload(file, product)
{
    console.log(file.name)
    await firebase.storage().ref('products/' + product.reference + '-' + product.color).put(file)
    await firebase.storage().ref().child('products/'+ product.reference + '-' + product.color).getDownloadURL().then(val => {
        product.photo = val;
        addProduct(product)
    })
    console.log(product)
}
