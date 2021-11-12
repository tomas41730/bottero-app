import db from '../firebase'
import { actualDate  } from '../firebase';
//import { onUpload } from '../firestore/FirebaseStorage';

export async function addProduct(product)
{
    product.due = actualDate.FieldValue.serverTimestamp();
    const incrementStock = actualDate.FieldValue.increment(parseInt(product.stock));  
    await db.collection('products').doc(product.id).get()
    .then(docSnapshot => {
        if(docSnapshot.exists){// si el producto existe
            db.collection('products').doc(product.id)
            .update({ 
                        reference: product.reference,
                        idShoe: product.idShoe,
                        id: product.condition + '-' + product.store + '-' + product.idShoe,
                        due: actualDate.FieldValue.serverTimestamp(),
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
                        photo: product.photo,
                        observation: product.observation
                   });
        }
        else
        {
            product.stock = parseInt(product.stock);
            //product.id = product.condition + '-' + product.store + '-' + product.idShoe;
            db.collection('products').doc(product.condition + '-' + product.store + '-' + product.idShoe).set(product);
            product.stock = product.stock.toString();
        }
    });
    product.due = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US');
}
export async function addProduct1(product)
{
    
    product.due = actualDate.FieldValue.serverTimestamp();
    const incrementStock = actualDate.FieldValue.increment(parseInt(product.stock));  
    
    await db.collection('products').where('idShoe', '==', product.idShoe).where('store', '==', product.store).where('condition', '==', product.condition).get()
    .then(docSnapshot => {
        docSnapshot.forEach(doc => {
            if(doc.exists){// si el producto existe
                db.collection('products').doc(doc.id)
                .update({ 
                            reference: product.reference,
                            idShoe: product.idShoe,
                            id: doc.data().id,
                            due: actualDate.FieldValue.serverTimestamp(),
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
                            photo: product.photo,
                            observation: product.observation
                       });
                console.log('exists-idShoe: ' + doc.data().id)
            }
            else
            {   
                const newDoc = db.collection('products').doc()
                product.stock = parseInt(product.stock);
                product.id = newDoc.id;
                db.collection('products').doc(product.id).set(product);
                product.stock = product.stock.toString();
                console.log('new-idShoe: ' + product.id)
            }
        })       
    });
    product.due = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US');
}

export function deleteProduct(product) 
{
    //db.collection('products').doc(product.store+"-"+product.idShoe).delete();
    db.collection('products').doc(product.condition+"-"+product.store+"-"+product.idShoe).delete()
}
export function deleteProductCondition(product) 
{
    db.collection('products').doc(product.condition+"-"+product.store+"-"+product.idShoe).delete();
}
export function getProducts()
{
    const products = []
    db.collection('products').orderBy('due','desc').get()
    .then(snapshot => {
        snapshot.docs.forEach(product => {
            let currentID = product.id
            let appObj = { ...product.data(), ['id']: currentID, ['due']: product.data().due && product.data().due.toDate().toLocaleDateString('en-US') +' '+ product.data().due.toDate().toLocaleTimeString('en-US') }
            products.push(appObj)
        })

    })
    return products
}
export function getProductById(id)
{
    const product = db.collection('products').doc(id).get();

    return product
}
export function getProductByIdShoe(idShoe)
{
    const product = db.collection('products').where('idShoe', '==', idShoe).where('photo', '!=', '').limit(1).get()
    return product
}
export function getProductByRef(ref)
{
    const product = db.collection('products').where('reference', '==', ref).where('photo', '!=', '').limit(1).get()
    return product
}
export function getProductsByRef(ref)
{
    const products = db.collection('products').where('reference', '==', ref).get()
    return products
}
export function getProductsByRefBrandIdShoe(ref, brand, idShoe)
{
    const products = db.collection('products').where('reference', '==', ref).where('brand', '==', brand).where('idShoe', '==', idShoe).get()
    return products
}
export async function getProductsByRefBrand(ref, brand)
{
    const products = db.collection('products').where('reference', '==', ref).where('brand', '==', brand).get()
    return products
}
export async function getProductsByRefBrandNew(ref, brand)
{
    const products = db.collection('products').where('reference', '==', ref).where('brand', '==', brand).where('condition', '==', 'Nuevo').get()
    return products
}
export async function getProductsByRefBrandCondition(ref, brand, condition)
{
    const products = db.collection('products').where('reference', '==', ref).where('brand', '==', brand).where('condition', '==', condition).get()
    return products
}
export async function getProductsByRefBrandMaterial(ref, brand, material)
{
    const products = db.collection('products').where('reference', '==', ref).where('brand', '==', brand).where('material', '==', material).get()
    return products
}
export function getProductsByIdShoeStore(idShoe, store)
{
    const products = db.collection('products').where('idShoe', '==', idShoe).where('store', '==', store).get();
    return products;
}
export function updateDescriptionProducts(id, description)
{
    db.collection('products').doc(id).update({ description: description, due: actualDate.FieldValue.serverTimestamp() });
}
export function updateCategoryProducts(id, category)
{
    db.collection('products').doc(id).update({ category: category, due: actualDate.FieldValue.serverTimestamp() });
}
export function updateConditionProducts(id, condition)
{
    db.collection('products').doc(id).update({ condition: condition, due: actualDate.FieldValue.serverTimestamp() });
}
export function updatePricesProducts(id, price, purchasePrice, oDisccount, pDisccount)
{
    db.collection('products').doc(id)
        .update(
            { 
                price: price,
                purchasePrice: purchasePrice,
                oDisccount: oDisccount,
                pDisccount: pDisccount,
                due: actualDate.FieldValue.serverTimestamp(),
            });
}
export async function addProductCondition(product, condition, observation)
{
    //product.due = actualDate.FieldValue.serverTimestamp();
    //const incrementStock = actualDate.FieldValue.increment(parseInt(product.stock)); 
    if (observation === null) observation = 'Sin Observación';
    await db.collection('products').doc(condition + '-' + product.store+ '-' +product.idShoe).get()
    .then(docSnapshot => {
        if(docSnapshot.exists){
            console.log('existe')
            db.collection('products').doc(condition + '-' + product.store + '-' + product.idShoe)
            .update({ 
                        reference: product.reference,
                        idShoe: product.idShoe,
                        id: condition + '-' + product.store + '-' + product.idShoe,
                        due: actualDate.FieldValue.serverTimestamp(),
                        brand: product.brand,
                        size: product.size,
                        color: product.color,
                        material: product.material,
                        price: product.price,
                        purchasePrice: product.purchasePrice,
                        stock: actualDate.FieldValue.increment(parseInt(product.stock)),
                        description: product.description,
                        category: product.category,
                        store: product.store,
                        pDisccount: product.pDisccount,
                        oDisccount: product.oDisccount,
                        condition: condition,
                        observation: observation,
                        photo: product.photo
                   });
            console.log('existe')
        }
        else
        {
            console.log('no existe')
            product.observation = observation;
            product.stock = parseInt(product.stock);
            product.due = actualDate.FieldValue.serverTimestamp();
            product.id = condition + '-' + product.store + '-' + product.idShoe;
            product.condition = condition;
            db.collection('products').doc(condition + '-' + product.store+ '-' +product.idShoe).set(product);
        }
    });
    product.due = new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US');
}

export async function updateProductStock(product, stock)
{
    product.due = actualDate.FieldValue.serverTimestamp();
    db.collection('products').doc(product.condition + '-' + product.store + '-' + product.idShoe)
            .update({ 
                        due: product.due,
                        stock: actualDate.FieldValue.increment(parseInt(stock)),
                        condition: 'Nuevo'
                   });
}
export async function getProductsByRefBrandMaterialColor(ref, brand, material, color)
{
    const products = db.collection('products')
    .where('reference', '==', ref)
    .where('brand', '==', brand)
    .where('material', '==', material)
    .where('color', '==', color)
    .get()
    return products
}


