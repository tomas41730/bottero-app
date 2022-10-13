import db from './firebase';
import { getProductByIdShoe } from '../services/firestore/FirebaseProducts2';
export async function updateByRefxIdShoe(ref, idShoe)
{
    db.collection('productsAux').where('reference', '==', ref).where('idShoe', '==', idShoe).get().then( snap => {
        if(snap.docs.length > 0)
        {
            snap.docs.forEach( doc => 
            {
            db.collection('productsAux').doc(doc.id).update({color: "Conhaque"});
            console.log(doc.data());
            });
        }
    });
}
export async function deleteByStore(store)
{
        db.collection('productsAux').where('store', '==', store).get().then( snap => 
        {
            if (snap.docs.length > 0)
            {
                snap.docs.forEach( doc => 
                {
                    db.collection('productsAux').doc(doc.id).delete();
                });
            }
        });
}
export async function setToStringType()
{
    db.collection('products').get().then( snapshot => 
    {
        snapshot.docs.forEach( doc => 
        {
            db.collection('products').doc(doc.id).update( {store: doc.data().store.toString(), idShoe: doc.data().idShoe.toString(), reference: doc.data().reference.toString()})
        });
    });
}
export async function deleteCondition()
{
        // para borrar la condicion
        db.collection('products').orderBy('stock', 'desc').get().then( snap => 
        {
            snap.docs.forEach( doc => 
            {
                if(doc.data().id.split('-').length < 3)
                {
                    console.log('mal id')
                }
                else
                {
                    let product = doc.data();
                    product.id = doc.data().store + '-' + doc.data().idShoe;
                    getProductByIdShoe(product.id).then( doc => 
                    {
                        if(!doc.exists)
                        {
                            db.collection('products').where('idShoe', '==', product.idShoe).where('store', '==', product.store).get().then( snap => 
                            {
                                snap.docs.forEach( doc => 
                                {
                                db.collection('products').doc(doc.data().id).delete();
                                })
                            });
                            db.collection('products').doc(product.id).set(product);
                        }
                    });
                }
            });
        });
}
export async function getProductsByDate(start, end)
{   
    console.log('start: ' + start);
    console.log('end: ' + end);
    db.collection('productsAux').where('due', '>', start).where('due', '<', end).get().then( snap =>
    {
        if (!snap.empty)
        {
            // snap.docs.forEach( doc => 
            // {
            //     console.log(doc.data());
            // });
            console.log(snap.docs.length);
            snap.docs.forEach( doc => 
            {
                db.collection('productsAux').doc(doc.id).update({ stock: 1});
            });
        }
        else
        {
            console.log('No data' + end);
        }
    });
}
export async function updateStockByStore(store, stock)
{   
    db.collection('productsAux').where('store', '==', store).get().then( snap =>
    {
        if (!snap.empty)
        {
            console.log(snap.docs.length);
            snap.docs.forEach( doc => 
            {
                db.collection('productsAux').doc(doc.id).update({ stock: stock});
                console.log('Eliminado');
            });
        }
        else
        {
            console.log('No data');
        }
    });
}
export async function deleteProductsByDate(start, end)
{   
    console.log('start: ' + start);
    console.log('end: ' + end);
    db.collection('subinventory').where('due', '>', start).where('due', '<', end).get().then( snap =>
    {
        if (!snap.empty)
        {
            console.log(snap.docs.length);
            snap.docs.forEach( doc => 
            {
                db.collection('subinventory').doc(doc.id).delete();
            });
        }
        else
        {
            console.log('No data' + end);
        }
    });
}