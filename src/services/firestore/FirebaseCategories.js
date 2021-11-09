import db from '../firebase'

export function addCategory(category)
{
    const newDoc = db.collection('categories').doc();
    category['id'] = newDoc.id;
    db.collection('categories').doc(newDoc.id).set(category);
}
export function updateCategory(category)
{
    db.collection('categories').doc(category.id).set(category);
}

export function deleteCategory(idColor) 
{
    db.collection('categories').doc(idColor).delete();   
}
export function getCategories()
{
    const categories = []
    db.collection('categories').orderBy('category', 'asc').get()
    .then(snapshot => {
        snapshot.docs.forEach(category => {
            // let appObj = { ...category.data(), ['id']: category.id };
            // categories.push(Object.assign({}, appObj));
            categories.push(category.data())
        });

    });
    return categories;
}
export function getCategoryNames()
{
    const categories = [];
    db.collection('categories').onSnapshot(snapshot => {
        snapshot.docs.forEach(category => {
            categories.push(Object.assign({}, category.data()).category);
        });

    });
    return categories;
}