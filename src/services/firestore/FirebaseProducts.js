import db from '../firebase'
import { actualDate  } from '../firebase';

export function checkPrices(product){
    if(product.price === null){ product.price = 0; } else { product.price = parseInt(product.price); }
    if(product.purchasePrice === null){ product.purchasePrice = 0; } else { product.purchasePrice = parseInt(product.purchasePrice); }
    if(product.oDisccount === null){ product.oDisccount = 0; } else { product.oDisccount = parseInt(product.oDisccount); }
    if(product.pDisccount === null){ product.pDisccount = 0; } else { product.pDisccount = parseInt(product.pDisccount); }
}
export async function addProduct(product)
{
    checkPrices(product);
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
    product.price = product.price.toString();
    product.purchasePrice = product.purchasePrice.toString();
    product.oDisccount = product.oDisccount.toString();
    product.pDisccount = product.pDisccount.toString();
}
export async function addInventory(product, date)
{
    let inventoryProds = [];

    db.collection('inventory').doc(date).get().then( snap => {
        if(snap.exists)
        {
            snap.data().productEntry.forEach( doc => {
                inventoryProds.push(doc);
            });
            inventoryProds.push(product);
            db.collection('inventory').doc(date).update({ productEntry: inventoryProds })
        }
        else
        {
            inventoryProds.push(product);
            let appObj = { productEntry: inventoryProds };
            db.collection('inventory').doc(date).set(appObj);
        }
    });
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
                price: parseInt(price),
                purchasePrice: parseInt(purchasePrice),
                oDisccount: parseInt(oDisccount),
                pDisccount: parseInt(pDisccount),
                due: actualDate.FieldValue.serverTimestamp(),
            });
}

export async function updateProductStock(product, stock)
{
    product.due = actualDate.FieldValue.serverTimestamp();
    db.collection('products').doc(product.id)
            .update({ 
                        due: product.due,
                        stock: actualDate.FieldValue.increment(parseInt(stock)),
                        condition: 'Nuevo'
                   });
}
export async function updateProductStockById(id, stock)
{
    let due = actualDate.FieldValue.serverTimestamp();
    db.collection('products').doc(id)
            .update({ 
                        due: due,
                        stock: actualDate.FieldValue.increment(parseInt(stock))
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
export function getProductsByStore(store)
{
    const products = []
    db.collection('products').where('store', '==', store).orderBy('idShoe', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(product => {
            let currentID = product.id
            let appObj = { ...product.data(), ['id']: currentID, ['due']: product.data().due && product.data().due.toDate().toLocaleDateString('en-US') +' '+ product.data().due.toDate().toLocaleTimeString('en-US') }
            products.push(appObj)
        })

    })
    return products
}


