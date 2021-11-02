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
    db.collection('stores').orderBy('name', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(store => {
            // let appObj = { ...store.data(), ['id']: store.id };
            // stores.push(Object.assign({}, appObj));
            stores.push(store.data());
        });
    });
    return stores
}
export function getStoresNames()
{
    const stores = []
    db.collection('stores').orderBy('name', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(store => {
            stores.push(store.data().name);
        });
    });
    return stores;
}