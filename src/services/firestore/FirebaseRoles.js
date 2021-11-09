import db from '../firebase'

export function addRole(role)
{
    const newDoc = db.collection('roles').doc()
    role['id'] = newDoc.id
    db.collection('roles').doc(newDoc.id).set(role);
}
export function updateRole(role)
{
    db.collection('roles').doc(role.id).set(role);
}

export function deleteRole(roleId) 
{
    db.collection('roles').doc(roleId).delete()       
}
export function getRoles()
{
    const roles = []
    db.collection('roles').get()
    .then(snapshot => {
        snapshot.docs.forEach(role => {
            let appObj = { ...role.data(), ['id']: role.id }
            roles.push(Object.assign({}, appObj))
        })

    })
    //console.log(roles)
    return roles
}
export function getRoleNames()
{
    const roles = []
    db.collection('roles').onSnapshot(snapshot => {
        snapshot.docs.forEach(role => {
            roles.push(Object.assign({}, role.data()).name)
        })

    })
    //console.log(roles)
    return roles
}
export function getIdRole(name)
{
    const role = db.collection("roles").where("name", "==", name).get()
    .then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //console.log("Roles "+name+": ", data[0]['id']);
      return data[0]['id'];
    });
    return role
}