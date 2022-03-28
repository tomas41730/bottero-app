// import { format, parseISO } from 'date-fns'
import db from '../firebase';


export async function addCustomer(customer)
{
    await db.collection('customers').doc(customer.ci).get().then(doc =>{
        if(doc.exists)
        {
            db.collection('customers').doc(customer.ci)
            .update({
                phone: customer.phone,
                birthday: customer.birthday,
                name: customer.name,
                email: customer.email
            });
        }
        else
        {
            db.collection('customers').doc(customer.ci).set(customer);
        }
        
    });
}

export function deleteCustomer(customer) 
{
    db.collection('customers').doc(customer.ci).delete();
}
export function getCustomers()
{
    const customers = [];
    db.collection('customers').get()
    .then(snapshot => {
        snapshot.docs.forEach(customer => {
            let currentID = customer.id;
            let appObj = { ...customer.data(), ['id']: currentID }
            customers.push(appObj);
        });

    });
    return customers
}
export function getCustomerByEmail(email)
{
    const customer = db.collection('customers').where('email', '==', email).get();
    return customer
}
export function getCustomerByCi(ci)
{
    const customer = db.collection('customers').doc(ci).get();
    return customer
}
