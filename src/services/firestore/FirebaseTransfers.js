import db from '../firebase'
import { actualDate  } from '../firebase';
import { updateProductStock } from './FirebaseProducts';

export async function addTransfer(transfer, destinyStore, sourceStore, quantity)
{
    await db.collection('counters').doc('transfers').get().then( docSnapshot => 
        {
            db.collection('transfers').doc('TRP-' + docSnapshot.data().counter).set(
                {
                    transfer: transfer,
                    date: actualDate.FieldValue.serverTimestamp(),
                    destiny: destinyStore,
                    source: sourceStore,
                    quantity: quantity
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
export function getTransfers()
{
    const transfers = []
    db.collection('transfers').get()
    .then(snapshot => {
        snapshot.docs.forEach(transfer => {
            // let appObj = { ...transfer.data(), ['id']: transfer.id };
            transfers.push(Object.assign({}, transfer.data()));
        });

    });
    return transfers;
}
