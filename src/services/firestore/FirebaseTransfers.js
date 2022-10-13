import db from '../firebase'
import { actualDate  } from '../firebase';
import { addNotification } from './FirebaseNotifications';
import { getProductById, updateProductStock } from './FirebaseProducts';
import { getProductByIdShoeAndStore } from './FirebaseProducts2';

export async function addTransfer(transfer, store, quantity)
{
    const nexDoc = db.collection('transfers').doc();
    let transferOrder = [];
    let stores = [];
    transfer.forEach( doc => {
        let product = {
            idShoe: doc.idShoe,
            id: doc.id,
            reference: doc.reference,
            quantity: doc.quantity,
            price: doc.price,
            store: doc.store,
            destiny: store,
            sent: false,
            received: false,
        }
        transferOrder.push(product);
        if(!stores.includes(doc.store))
        {
            stores.push(doc.store);
        }
    });
    await db.collection('counters').doc('transfers1').get().then( docSnapshot => 
    {
        db.collection('transfers').doc(nexDoc.id).set(
            {
                id: nexDoc.id,
                transfer: transferOrder,
                date: actualDate.FieldValue.serverTimestamp(),
                shortDate: new Date().toLocaleDateString('es-BO'),
                store: store,
                transferStores: stores,
                quantity: quantity,
                transferId: docSnapshot.data().counter,
                numberTransfer: parseInt(docSnapshot.data().counter),
                finished: false,
            });
        console.log(docSnapshot.data().counter);  
        db.collection('counters').doc('transfers1')
        .update({ 
                    counter: actualDate.FieldValue.increment(1)
                });
        console.log('existe')
        stores.forEach( item => 
        {
            addNotification(store, item, parseInt(docSnapshot.data().counter), 'Solicitud de Traspaso');
        }); 
    });
    transfer.forEach( product => {
        updateProductStock(product, -(product.quantity));
    });
}
export async function updateTransfer(transfer, transferList)
{
    let transferOrder = [];
    transferList.forEach( doc => {
        let appObj = {
            id: doc.itemId,
            idShoe: doc.idShoe,
            quantity: doc.quantity,
            sent: doc.sent,
            received: doc.received,
            reference: doc.reference,
            selected: doc.selected,
            dateSent: doc.dateSent,
            timeSent: doc.timeSent,
            dateReceived: doc.dateReceived,
            timeReceived: doc.timeReceived,
            receivedBy: doc.receivedBy,
            seller: doc.seller,
            destiny: doc.destiny,
            store: doc.store
        }
        
        transferOrder.push(appObj);
    });
    console.log('service:');
    console.log(transferOrder);
    db.collection('transfers').doc(transfer.id).update({ transfer: transferOrder });
}
export function updateFinishedTransfer(id, finished)
{
    db.collection('transfers').doc(id).update({finished: finished});
}
export function getTransfers()
{
    const transfers = []


    db.collection('transfers').orderBy('date','desc').get()
    .then(snapshot => {
        snapshot.docs.forEach(transfer => {
            let completed = true;
            transfer.data().transfer.forEach(element => {
                    completed = completed && element.received
            }) 

            let appObj = 
            {...transfer.data(), 
                ['stores']: transfer.data().tranferStores.toString(), 
                ['date']: transfer.data().date && transfer.data().date.toDate().toLocaleDateString('es-BO') +' '+ transfer.data().date.toDate().toLocaleTimeString('es-BO'), 
                ['completed']: completed
            }
            transfers.push(appObj);
        });

    });
    return transfers;
}
export function getEachTransfer()
{
    const reserves = [];
    db.collection('reserves').orderBy('date','desc').get()
    .then(snapshot => 
    {
        snapshot.docs.forEach( sale => 
        {
            let appObj = {...sale.data()};
            appObj.date = sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO') +' '+ sale.data().date.toDate().toLocaleTimeString('en-US');
            appObj.sale = sale.data().sale;
            sale.data().sale.forEach( doc => 
            {
                appObj.idShoe = doc.id;
                getProductById(doc.id).then( snap => 
                {
                    if(snap.exists)
                    {
                        appObj.reference = snap.data().reference;
                        appObj.size = snap.data().size;
                        appObj.color = snap.data().color;
                        appObj.material = snap.data().material;
                        appObj.storeDestiny = snap.data().store;
                        reserves.push(appObj);
                        appObj = {};
                    }
                });
                
            });
        });
    });
    return reserves;
}

export function getEachTransfer1()
{
    const transfers = [];
    db.collection('transfers').orderBy('date', 'desc').get().then( snap => 
    {
        if(!snap.empty)
        {
            snap.docs.forEach( doc => 
            {
                doc.data().transfer.forEach( item => 
                {   
                    let obj = {};
                    obj.date = doc.data().date && doc.data().date.toDate().toLocaleDateString('es-BO') +' '+ doc.data().date.toDate().toLocaleTimeString('en-US');
                    obj.transferId = doc.data().transferId;
                    obj.id = doc.id;
                    obj.finished = doc.data().finished;
                    obj.transferStores = doc.data().transferStores.toString();
                    obj.quantity = doc.data().quantity;
                    obj.itemId = item.id;
                    obj.idShoe = item.idShoe;
                    obj.itemQuantity = item.quantity;
                    obj.received = item.received;
                    obj.reference = item.reference;
                    obj.store = item.store;
                    obj.sent = item.sent;
                    obj.destiny = item.destiny;
                    obj.transfer = doc.data().transfer;
                    obj.transfer.forEach( shoe => 
                    {
                        getProductByIdShoeAndStore(shoe.idShoe, shoe.store).then( prod => 
                        {
                            
                            if(prod.exists)
                            {
                                shoe.date = obj.date;
                                shoe.size = prod.data().size;
                                shoe.color = prod.data().color;
                                shoe.material = prod.data().material;
                            }
                            else
                            {
                                console.log('El producto no existe.');
                            }
                        });
                    });
                            
                        
                    getProductByIdShoeAndStore(item.idShoe, item.store).then( prod => 
                    {
                        
                        if(prod.exists)
                        {
                            obj.size = prod.data().size;
                            obj.color = prod.data().color;
                            obj.material = prod.data().material;
                            transfers.push(obj);
                        }
                        else
                        {
                            console.log('El producto no existe.');
                        }
                    });
                });
            });
        }
    });
    return transfers;
}
export function getEachTransferByID(id)
{
    const transfers = [];
    db.collection('transfers').where('id', '==', id).orderBy('date', 'desc').get().then( snap => 
        {
            if(!snap.empty)
            {
                snap.docs.forEach( doc => 
                {
                    
                    doc.data().transfer.forEach( item => 
                    {   
                        let obj = {};
                        obj.date = doc.data().date && doc.data().date.toDate().toLocaleDateString('es-BO') +' '+ doc.data().date.toDate().toLocaleTimeString('en-US');
                        obj.transferId = doc.data().transferId;
                        obj.itemId = item.id;
                        obj.idShoe = item.idShoe;
                        obj.quantity = item.quantity;
                        obj.received = item.received;
                        obj.reference = item.reference;
                        obj.store = item.store;
                        obj.sent = item.sent;
                        obj.destiny = item.destiny;
                        obj.dateSent = item.dateSent;
                        obj.timeSent = item.timeSent;
                        obj.seller = item.seller;
                        getProductByIdShoeAndStore(item.idShoe, item.store).then( prod => 
                        {
                            
                            if(prod.exists)
                            {
                                obj.size = prod.data().size;
                                obj.color = prod.data().color;
                                obj.material = prod.data().material;
                                transfers.push(obj);
                            }
                            else
                            {
                                console.log('El producto no existe.');
                            }
                        });
                    });
                });
            }
        });
    return transfers;
}