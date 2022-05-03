import db from '../firebase'
import { actualDate  } from '../firebase';
import { updateProductStock } from './FirebaseProducts';

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
    await db.collection('counters').doc('transfers').get().then( docSnapshot => 
        {
            db.collection('transfers').doc(nexDoc.id).set(
                {
                    id: nexDoc.id,
                    transfer: transferOrder,
                    date: actualDate.FieldValue.serverTimestamp(),
                    store: store,
                    tranferStores: stores,
                    quantity: quantity,
                    transferId: 'TRP-' + docSnapshot.data().counter,
                    numberTransfer: parseInt(docSnapshot.data().counter)
                });
            console.log(docSnapshot.data().counter);

            db.collection('counters').doc('transfers')
            .update({ 
                        counter: actualDate.FieldValue.increment(1)
                    });
            console.log('existe')
        }
    );
    transfer.forEach( product => {
        updateProductStock(product, -(product.quantity));
    });
}
export async function updateTransfer(transfer, transferList)
{
    let transferOrder = [];
    transferList.forEach( doc => {
        let appObj = {
            id: doc.id,
            idShoe: doc.idShoe,
            quantity: doc.quantity,
            sent: doc.sent,
            received: doc.received,
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
    console.log(transferOrder);
    db.collection('transfers').doc(transfer.id).update({ transfer: transferOrder });
}
export function getTransfers()
{
    const transfers = []


    db.collection('transfers').get()
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
