import db from '../firebase'

export function addBrand(brands)
{
    const newDoc = db.collection('brands').doc();
    brands['id'] = newDoc.id;
    db.collection('brands').doc(newDoc.id).set(brands);
}
export function updateBrand(brands)
{
    db.collection('brands').doc(brands.id).set(brands);
}

export function deleteBrand(idColor) 
{
    db.collection('brands').doc(idColor).delete();   
}
export function getBrands()
{
    const brands = []
    db.collection('brands').orderBy('brand', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(brand => {
            let appObj = { ...brand.data(), ['id']: brand.id };
            brands.push(Object.assign({}, appObj));
        });

    });
    return brands;
}
export function getBrandNames()
{
    const brands = [];
    db.collection('brands').orderBy('brand', 'asc').onSnapshot(snapshot => {
        snapshot.docs.forEach(brand => {
            brands.push(Object.assign({}, brand.data()).brand);
        });

    });
    return brands;
}