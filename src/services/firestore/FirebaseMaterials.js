import db from '../firebase'

export function addMaterial(materials)
{
    const newDoc = db.collection('materials').doc();
    materials['id'] = newDoc.id;
    db.collection('materials').doc(newDoc.id).set(materials);
}
export function updateMaterial(materials)
{
    db.collection('materials').doc(materials.id).set(materials);
}

export function deleteMaterial(idColor) 
{
    db.collection('materials').doc(idColor).delete();   
}
export function getMaterials()
{
    const materials = []
    db.collection('materials').get()
    .then(snapshot => {
        snapshot.docs.forEach(material => {
            let appObj = { ...material.data(), ['id']: material.id };
            materials.push(Object.assign({}, appObj));
        });

    });
    return materials;
}
export function getMaterialNames()
{
    const materials = [];
    db.collection('materials').onSnapshot(snapshot => {
        snapshot.docs.forEach(material => {
            materials.push(Object.assign({}, material.data()).material);
        });

    });
    return materials;
}