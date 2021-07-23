import db from '../firebase'



export function addStore(store)
{
    const newDoc = db.collection('stores').doc()
    store['id'] = newDoc.id
    db.collection('stores').doc(newDoc.id).set(store);
    console.log('add ' + newDoc.id)
}
export function updateStore(storeId, store)
{
    console.log('store: ' + store + ' ID: ' + storeId)
    db.collection('stores').doc(storeId).set(store);
    console.log('update')
}

export function deleteStore(idStore) 
{
    db.collection('stores').doc(idStore).delete()       
}
export function getStores()
{
    const stores = []
    db.collection('stores').get()
    .then(snapshot => {
        snapshot.docs.forEach(store => {
            let appObj = { ...store.data(), ['id']: store.id }
            stores.push(Object.assign({}, appObj))
            //users.push(user.data())
        })

    })
    console.log(stores)
    return stores
}
export function getStoresNames()
{
    const stores = []
    db.collection('stores').get()
    .then(snapshot => {
        snapshot.docs.forEach(store => {
            //let currentID = store.id
            //let appObj = { ...store.data() }
            stores.push(Object.assign({}, store.data()).nombre)
            //stores.push(user.data())
        })

    })
    console.log(stores)
    return stores
}