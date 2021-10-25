//import storage from '../firebase'
import firebase from 'firebase/app'
import 'firebase/storage'
import { addProduct } from '../firestore/FirebaseProducts'
export async function onUpload(file, product)
{
    console.log(file.name);
    await firebase.storage().ref('products/' + product.reference + '-' + product.material + '-' + product.color).put(file);
    await firebase.storage().ref().child('products/' + product.reference + '-' + product.material + '-' + product.color).getDownloadURL().then(val => {
        product.photo = val;
        addProduct(product);
    })
    console.log(product);
}
export function getDefaultProductPhotho()
{
    return firebase.storage().ref().child('utilities/logo.png').getDownloadURL();
}
export async function onUploadBatchProducts(file, product)
{
    await firebase.storage().ref('products/' + product.reference + '-' + product.material + '-' + product.color).put(file);
}
export async function updateProductPhoto()
{
    // await firebase.storage().ref().child('products/' + product.reference + '-' + product.material + '-' + product.color).getDownloadURL().then(val => {
        // product.photo = val;
        // addProduct(product);
    //     getProductsByRefBrandMaterialColor(this.reference, this.brand, this.material, this.color).then(snap =>{
    //         snap.forEach(doc => {
    //             firebase.firestore().collection('products').doc('')
    //         });
    //       });
    // })
}