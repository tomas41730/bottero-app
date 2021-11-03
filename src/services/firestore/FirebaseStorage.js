//import storage from '../firebase'
import firebase from 'firebase/app'
import 'firebase/storage'
import { addProduct, getProductsByRefBrandMaterialColor } from '../firestore/FirebaseProducts'
export async function onUpload(file, product)
{
    console.log(file.name);
    await firebase.storage().ref('products/' + product.brand + '-' + product.reference + '-' + product.color + '-' + product.material).put(file);
    await firebase.storage().ref().child('products/' + product.brand + '-' + product.reference + '-' + product.color + '-' + product.material).getDownloadURL().then(val => {
        product.photo = val;
        addProduct(product);
    })
    console.log(product);
}
export function getDefaultProductPhotho()
{
    return firebase.storage().ref().child('utilities/logo.png').getDownloadURL();
}
export async function onUploadBatchProducts(file, brand, ref, color, material)
{
    await firebase.storage().ref('products/' + brand + '-' +ref + '-' + color + '-' + material).put(file);
}
export async function updateProductPhoto(ref, brand, material, color)
{
    await firebase.storage().ref().child('products/' + brand + '-' +ref + '-' + color + '-' + material).getDownloadURL().then(val => {
        getProductsByRefBrandMaterialColor(ref, brand, material, color).then(snap =>{
            snap.forEach(doc => {
                firebase.firestore().collection('products').doc(doc.data().id).update({ photo: val });
            });
          });
    })
}