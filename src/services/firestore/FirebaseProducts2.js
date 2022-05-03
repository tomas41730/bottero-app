import db from '../firebase'
import firebase from 'firebase/app'
// Storage functions
export async function uploadProductPhoto(file, ref, color, material, brand)
{
    await firebase.storage().ref('products/' + ref + '-' + color + '-' + material + '-' + brand).put(file).catch();
}
export async function updateProductPhoto(ref, color, material, brand)
{
    await firebase.storage().ref().child('products/'+ ref + '-' + color + '-' + material + '-' + brand).getDownloadURL().then(val => {
        getProductsByRefBrandColorMaterial(ref, brand, color, material).then(snap =>{
            snap.forEach(doc => {
                db.collection('products').doc(doc.data().id).update({ photo: val });
            });
          });
    })
}
// Geters
export function getProductsByStore(store)
{
    // console.log(store);
    const products = []
    db.collection('products').where('store', '==', store).orderBy('idShoe', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(product => {
            let currentID = product.id
            let appObj = 
            { 
                ...product.data(), 
                ['id']: currentID, 
                ['due']: product.data().due && product.data().due.toDate().toLocaleDateString('en-US') +' '+ product.data().due.toDate().toLocaleTimeString('en-US'), 
                ['diference']: 0,
                ['auxStock']: 0,
            }
            products.push(appObj)
        })
    })
    return products
}
export function getProductsByIdShoe(input)
{
    const products = [];
    db.collection('products').where('idShoe', '==', input).get().then(snapshot => {
        if(snapshot.docs.length > 0)
        {
            fillArray(snapshot, products);
        }
        else
        {
            db.collection('products').where('reference', '==', input).get().then(snapshot => 
            {
                if(snapshot.docs.length > 0)
                {
                    fillArray(snapshot, products);
                }
            });
        }
    });
    return products
}
export function getPorductsByCustomFilter(columns, input)
{
    const products = [];
    columns.forEach( column => 
        {
            db.collection('products').where(column, '==', input).get().then( snapshot => 
                {
                    if(snapshot.docs.length > 0)
                    {
                        fillArray(snapshot, products);
                    }
                    else
                    {
                        console.log('Se encontrarón ' + snapshot.docs.length + ' ocurrencias en ' + column + ' con la entrada ' + input);
                    }
                });
        })
    return products;
}
export function getProductsByRef(reference)
{
    return db.collection('products').where('reference', '==', reference).get();
}
export function getProductsByRefCondition(reference, condition)
{
    return db.collection('products').where('reference', '==', reference).where('condition', '==', condition).get();
}
export async function getProductsByRefBrandColorMaterial(ref, brand, color, material)
{
    const products = db.collection('products')
    .where('reference', '==', ref)
    .where('brand', '==', brand)
    .where('material', '==', material)
    .where('color', '==', color)
    .get()
    return products
}
// Updates
export async function updateProductBC1(id, product)
{
    await db.collection('products').doc(id).get().then( doc => 
    {
        if(doc.exists)
        {
            db.collection('products').doc(id).update(
            {
                reference: product.reference,
                category: product.category,
                color: product.color,
                description: product.description,
                price: product.price,
                purchasePrice: product.purchasePrice,
                oDisccount: product.oDisccount,
                pDisccount: product.pDisccount,
                material: product.material
            });
        }
        else
        {
            console.log('No se encontro coincidencias para: ' + product.id);
        }
    });
}
// Auxiliar functions
export function fillArray(snapshot, products)
{
    snapshot.docs.forEach(product => {
        let currentID = product.id;
        let datetime = product.data().due && product.data().due.toDate().toLocaleDateString('en-US') +' '+ product.data().due.toDate().toLocaleTimeString('en-US');
        let item = product.data().reference + ' ' + product.data().size + ' ' + product.data().color + ' ' + product.data().material + ' ' + product.data().store;
        let appObj = 
        { ...product.data(), 
            ['id']: currentID, 
            ['due']: datetime,
            ['datetime']: new Date(datetime).getTime(),
            ['customColumn']: item,
            ['stock1']: product.data().stock.toString()
        }
        products.push(appObj)
    });
}