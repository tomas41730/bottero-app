import db from '../firebase'

export function addUser(user)
{
    db.collection('users').doc(user.ci).set(user);
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
        })

    })
    //console.log(users)
    return users
}