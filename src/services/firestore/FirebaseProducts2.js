import db from '../firebase'
import firebase from 'firebase/app'
import { actualDate  } from '../firebase';
import { createAlert, createAlert2 } from '../Alerts';
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
                db.collection('productsAux').doc(doc.data().id).update({ photo: val });
            });
        });
    })
}
// Adds
export async function addProduct2(product)
{
    // const incrementStock = actualDate.FieldValue.increment(parseInt(product.stock));
    await db.collection('productsAux').doc(product.store + '-' + product.idShoe).get().then(doc => 
    {
        if(doc.exists)
        {
            let st = doc.data().stock;
            db.collection('productsAux').doc(product.store + '-' + product.idShoe).set(product)
            db.collection('productsAux').doc(product.store + '-' + product.idShoe)
            .update(
                {   
                    stock: (parseInt(st) +  parseInt(product.stock)), 
                    due: actualDate.FieldValue.serverTimestamp()
                });
        }
        else
        {
            product.due = actualDate.FieldValue.serverTimestamp();
            db.collection('productsAux').doc(product.store + '-' + product.idShoe).set(product);
        }
    })
    .catch(function(error) 
    {
        console.error("Error saving product: ", error);
        createAlert('Error al registrar','error');
    });
}
export async function addProduct(product)
{
    // const incrementStock = actualDate.FieldValue.increment(parseInt(product.stock));
    await db.collection('productsAux').doc(product.store + '-' + product.idShoe).get().then(doc => 
    {
        if(doc.exists)
        {
            let st = doc.data().stock;
            if((parseInt(st) +  parseInt(product.stock)) >= 0)
            {
                db.collection('productsAux').doc(product.store + '-' + product.idShoe).set(product)
                db.collection('productsAux').doc(product.store + '-' + product.idShoe).update({ stock: (parseInt(st) + (parseInt(product.stock))), due: actualDate.FieldValue.serverTimestamp()})
                createAlert('Producto actualizado correctamente!','success');
            }
            else
            {
                createAlert2('No se puede tener un stock menor a 0.', 'error');
            }
        }
        else
        {
            product.due = actualDate.FieldValue.serverTimestamp();
            db.collection('productsAux').doc(product.store + '-' + product.idShoe).set(product);
            createAlert('Producto agregado correctamente!','success');
        }
    })
    .catch(function(error) 
    {
        console.error("Error saving post : ", error);
        createAlert('Error al registrar','error');
    });
}
export function addSubinventory(details, store)
{
    const newDoc = db.collection('subinventory').doc();
    let subinventory = {}
    subinventory.id = newDoc.id;
    subinventory.due = actualDate.FieldValue.serverTimestamp();
    subinventory.details = details;
    subinventory.store = store;
    db.collection('subinventory').doc(newDoc.id).set(subinventory);
}
// Delete
export function deleteProduct(id)
{
    db.collection('productsAux').doc(id).delete();
    createAlert2('Producto ' + id + ' eliminado correctamente.', 'success');
}
// Geters
export function getProducts()
{
    const products = []
    db.collection('productsAux').orderBy('due','desc').get()
    .then(snapshot => {
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
        })
    })
    return products
}
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
export function getProducts2()
{
    // console.log(store);
    const products = []
    db.collection('products').orderBy('idShoe', 'asc').get()
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
export function getProductByIdShoe(id)
{
    return db.collection('productsAux').where('idShoe', '==', id).get();
}
export function getProductByIdShoeLast(id)
{
    return db.collection('productsAux').where('idShoe', '==', id).orderBy('due', 'desc').limit(1).get();
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
export async function getProductByIdShoeAndStore(input, store)
{
    return db.collection('productsAux').doc(store + '-' + input).get()
}
export function getPorductsByCustomFilter(columns, input)
{
    const products = [];
    columns.forEach( column => 
        {
            db.collection('productsAux').where(column, '==', input).orderBy('due', 'desc').get().then( snapshot => 
                {
                    if(snapshot.docs.length > 0)
                    {
                        fillArray(snapshot, products);
                    }
                    // else
                    // {
                        console.log('Se encontrarón ' + snapshot.docs.length + ' ocurrencias en ' + column + ' con la entrada ' + input);
                    // }
                });
        })
    return products;
}
export function getProductsByRef(reference)
{
    return db.collection('productsAux').where('reference', '==', reference).get();
}
export function getProductsByRefCondition(reference, condition)
{
    return db.collection('products').where('reference', '==', reference).where('condition', '==', condition).get();
}
export function getProductsByRefStore(reference, store)
{
    return db.collection('productsAux').where('reference', '==', reference).where('store', '==', store).get();
}
export async function getProductsByRefBrandColorMaterial(ref, brand, color, material)
{
    const products = db.collection('productsAux')
    .where('reference', '==', ref)
    .where('brand', '==', brand)
    .where('material', '==', material)
    .where('color', '==', color)
    .get()
    return products
}
// Updates
export async function updateProductBC1(product)
{
    await db.collection('productsAux').doc(product.id).get().then( doc => 
    {
        if(doc.exists)
        {
            db.collection('productsAux').doc(product.id).update(
            {
                reference: product.reference,
                category: product.category,
                brand: product.brand,
                description: product.description,
                price: product.price,
                purchasePrice: product.purchasePrice,
                oDiscount: product.oDiscount,
                pDiscount: product.pDiscount,
                material: product.material,
                color: product.color,
                size: product.size
            })
            .catch(function(error) 
            {
                console.error("Error saving product: ", error);
                createAlert('Error al registrar','error');
            });
        }
        else
        {
            console.log('No se encontro coincidencias para: ' + product.id);
        }
    });
}
export function updateProductStock(id, stock)
{
    db.collection('productsAux').doc(id).update({ stock: stock });
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