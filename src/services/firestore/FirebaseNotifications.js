// import { createAlert2 } from '../Alerts';
import db, { actualDate } from '../firebase'
import store from '../../store';

export async function getNotifications()
{
    await db.collection('counters').doc('transfers1').get().then( docSnapshot => 
    {
        db.collection('notifications').orderBy('date', 'asc').onSnapshot( querySnapshot => 
        {
            querySnapshot.docChanges().forEach( change => 
            {
                // let msg = `${change.doc.data().type} para la sucursal ${change.doc.data().destiny}, revisar el Trapaso # ${change.doc.data().transferId} - cnt: ${docSnapshot.data().counter}`;
                // console.log(change.doc.data());
                // createAlert2(msg, 'success');

                if (change.type === 'added') 
                {
                    if(change.doc.data().destiny == store.state.userStore && change.doc.data().transferId + 1 == docSnapshot.data().counter)
                    {
                        
                        // createAlert2(msg, 'success');
                        console.log(store.state.userStore);
                    }
                }
            });
        });
    }); 
    return true;
}
export function addNotification(store, destiny, transferId, type)
{
    let notification = {
        date: actualDate.FieldValue.serverTimestamp(),
        store: store,
        destiny: destiny,
        transferId: transferId,
        type: type,
        seen: false
    }
    db.collection('notifications').add(notification);
}

export function getNotifications1()
{
    let notifications = [];
    db.collection('notifications').orderBy('date','desc').get().then( snap => 
    {
        if(!snap.empty)
        {
            snap.forEach( doc => 
            {
                let not = doc.data();
                not.id = doc.id;
                not.date = doc.data().date && doc.data().date.toDate().toLocaleDateString('es-BO') +' '+ doc.data().date.toDate().toLocaleTimeString('es-BO')
                notifications.push(not);
            });
        }
    });
    console.log(notifications);
    return notifications;
}