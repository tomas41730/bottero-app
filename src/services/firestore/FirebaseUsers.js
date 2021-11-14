import db , { auth } from '../firebase'
import { getIdRole } from './FirebaseRoles'

export async function addUser(user)
{
    await db.collection('users').doc(user.ci).get().then(doc =>{
        if(doc.exists)
        {
            db.collection('users').doc(user.ci).set(user);
        }
        else
        {
            db.collection('users').doc(user.ci).set(user).then(() => {
                auth.createUserWithEmailAndPassword(user.email, user.password);
            });
        }
    });
    await getIdRole(user.role).then(snap =>{
        snap.forEach(doc =>{ 
            db.collection('users').doc(user.ci).update({ idRole: doc.data().id })
        })
    })
}

export function deleteUser(ci) 
{
    db.collection('users').doc(ci).delete()
}
export function getUsers()
{
    const users = []
    db.collection('users').get()
    .then(snapshot => {
        snapshot.docs.forEach(user => {
            let currentID = user.id
            let appObj = { ...user.data(), ['id']: currentID }
            users.push(appObj)
        });

    });
    return users
}
export function getUserByEmail(email)
{
    const product = db.collection('users').where('email', '==', email).get()
    return product
}
