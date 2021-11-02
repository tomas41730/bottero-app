import db from '../firebase'

export function addSize(size)
{
    const newDoc = db.collection('sizes').doc();
    size['id'] = newDoc.id;
    db.collection('sizes').doc(newDoc.id).set(size);
}
export function updateSize(size)
{
    db.collection('sizes').doc(size.id).set(size);
}

export function deleteSize(idColor) 
{
    db.collection('sizes').doc(idColor).delete();   
}
export function getSizes1()
{
    const sizes = []
    db.collection('sizes').get()
    .then(snapshot => {
        snapshot.docs.forEach(size => {
            let appObj = { ...size.data(), ['id']: size.id };
            sizes.push(Object.assign({}, appObj));
        });

    });
    return sizes;
}
export function getSizes()
{
    const sizes = []
    db.collection('sizes').orderBy('size', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(size => {
            sizes.push(size.data());
        });

    });
    return sizes;
}
export function getSizeNames()
{
    const sizes = [];
    db.collection('sizes').orderBy('size', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(size => {
            sizes.push(size.data().size);
        });

    });
    return sizes;
}