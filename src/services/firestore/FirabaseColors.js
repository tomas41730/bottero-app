import db from '../firebase'

export function addColor(color)
{
    const newDoc = db.collection('colors').doc();
    color['id'] = newDoc.id;
    db.collection('colors').doc(newDoc.id).set(color);
}
export function updateColor(color)
{
    db.collection('colors').doc(color.id).set(color);
}

export function deleteColor(idColor) 
{
    db.collection('colors').doc(idColor).delete();       
}
export function getColors()
{
    const colors = [];
    db.collection('colors').orderBy('color', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(color => {
            let appObj = { ...color.data(), ['id']: color.id };
            colors.push(Object.assign({}, appObj));
        });
    });
    return colors;
}
export function getColorNames()
{
    const colors = [];
    db.collection('colors').orderBy('color', 'asc').onSnapshot(snapshot => {
        snapshot.docs.forEach(color => {
            colors.push(Object.assign({}, color.data()).color);
        });
    });
    return colors;
}