import db from '../firebase'

export function addStore(store)
{
    const newDoc = db.collection('stores').doc();
    store['id'] = newDoc.id;
    db.collection('stores').doc(newDoc.id).set(store);
}
export function updateStore(store)
{
    db.collection('stores').doc(store.id).set(store);
}

export function deleteStore(idStore) 
{
    db.collection('stores').doc(idStore).delete();      
}
export function getStores()
{
    const stores = []
    db.collection('stores').get()
    .then(snapshot => {
        snapshot.docs.forEach(store => {
            let appObj = { ...store.data(), ['id']: store.id };
            stores.push(Object.assign({}, appObj));
        });
    });
    return stores
}
export function getStoresNames()
{
    const stores = []
    db.collection('stores').get()
    .then(snapshot => {
        snapshot.docs.forEach(store => {
            stores.push(Object.assign({}, store.data()).nombre);
        });
    });
    return stores;
}