import db from '../firebase'
import { actualDate  } from '../firebase';
//import { onUpload } from '../firestore/FirebaseStorage';

export async function addProduct(product)
{
    product.due = actualDate.FieldValue.serverTimestamp()
    const incrementStock = actualDate.FieldValue.increment(product.stock)    
    await db.collection('products').doc(product.store+"-"+product.idShoe).get()
    .then(docSnapshot => {
        if(docSnapshot.exists){
            console.log('Existe');
            console.log(docSnapshot.data());
            console.log('Existe');
            db.collection('products').doc(product.store+"-"+product.idShoe)
            .update({ 
                        reference: product.reference,
                        idShoe: product.idShoe,
                        due: product.due,
                        brand: product.brand,
                        size: product.size,
                        color: product.color,
                        material: product.material,
                        price: product.price,
                        purchasePrice: product.purchasePrice,
                        stock: incrementStock,
                        description: product.description,
                        category: product.category,
                        store: product.store,
                        pDisccount: product.pDisccount,
                        oDisccount: product.oDisccount,
                        condition: product.condition,
                        photo: product.photo
                   });
        }
        else
        {
            console.log('No Existe');
            product.stock = parseInt(product.stock);
            db.collection('products').doc(product.store+"-"+product.idShoe).set(product);
        }
    });
    product.due = new Date().toLocaleDateString('en-US');
}

export function deleteProduct(product) 
{
    db.collection('products').doc(product.store+"-"+product.idShoe).delete()
}
export function getProducts()
{
    const products = []
    db.collection('products').get()
    .then(snapshot => {
        snapshot.docs.forEach(product => {
            let currentID = product.id
            let appObj = { ...product.data(), ['id']: currentID, ['due']: product.data().due && product.data().due.toDate().toLocaleDateString('en-US') }
            products.push(appObj)
        })

    })
    //console.log(products)
    return products
}
export function getProductById(id)
{
    const product = db.collection('products').where('idShoe', '==', id).where('photo', '!=', '').limit(1).get()

    return product
}
export function getProductByRef(ref)
{
    const product = db.collection('products').where('reference', '==', ref).where('photo', '!=', '').limit(1).get()
    return product
}
export function getProductByStore(store)
{
    const product = db.collection('products').where('store', '==', store).where('photo', '!=', '').limit(1).get()
    console.log(product)
    return product
}

