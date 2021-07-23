import db from '../firebase'

export function addUser(ci, user)
{
    db.collection('users').doc(ci).set(user);
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
            //users.push(user.data())
        })

    })
    console.log(users)
    return users
}