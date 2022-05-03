import db from '../firebase'
import { actualDate  } from '../firebase';
import { updateProductStock } from './FirebaseProducts';
import { format, parseISO } from 'date-fns';

export async function addReserve(sale, customer, total, totalDiscount, totalQuantity, efective, payment, store, dateReserve)
{
    console.log('dateReserve1: ' + dateReserve );
    console.log('date1: ' + new Date(dateReserve).toLocaleDateString('es-BO'));
    console.log('time1: ' + new Date(dateReserve).toLocaleTimeString('es-BO'));
    const newDoc = db.collection('reserves').doc();
    let saleOrder = [];
    let billNumber = 0;
    let paymentHistory = [];
    let dateStr = format(parseISO(dateReserve), 'dd/M/yyyy');
    let firstPay = { date: new Date(dateStr).toLocaleDateString('en-BO'), time: new Date(Date.now()).toLocaleTimeString('es-BO'), amount: parseInt(efective), payment: payment, store: store }
    paymentHistory.push(firstPay);
    sale.forEach( doc => {
        let product = {
            idShoe: doc.idShoe,
            id: doc.id,
            reference: doc.reference,
            discount: doc.discount,
            subtotal: doc.subtotal,
            quantity: doc.quantity,
            price: doc.price,
            store: doc.store
        }
        saleOrder.push(product);
    });
    let date = format(parseISO(dateReserve), 'M/d/yyyy');
    await db.collection('counters').doc('reserves').get().then( docSnapshot => 
        {           
            db.collection('reserves').doc(newDoc.id).set(
                {
                    id: newDoc.id,
                    idReserve: docSnapshot.data().number,
                    billNumber: billNumber,
                    sale: saleOrder,
                    paymentHistory: paymentHistory, 
                    subtotal: total,
                    total: total - totalDiscount,
                    totalDiscount: totalDiscount,
                    store: store,
                    date: actualDate.Timestamp.fromDate(new Date(date)),
                    shortDate: dateReserve,
                    customerPhone: customer.phone,
                    name: customer.name,
                    totalQuantity: totalQuantity,
                    payed: parseInt(efective),
                    balance: (total - totalDiscount) - efective,
                });
            console.log(docSnapshot.data().counter);

            db.collection('counters').doc('reserves')
                .update({ 
                        number: actualDate.FieldValue.increment(1)
                    });
            });
    sale.forEach( product => {
        updateProductStock(product, -(product.quantity));
    });
}
export async function updateReservePays(reserve)
{
    db.collection('reserves').doc(reserve.id)
    .update({
        balance: reserve.balance,
        payed: reserve.payed,
        paymentHistory: reserve.paymentHistory
    });
}

export function getReserves()
{
    const sales = []
    db.collection('reserves').orderBy('date', 'desc').get()
    .then(snapshot => {
        snapshot.docs.forEach(sale => {
            let appObj = {...sale.data(), ['date']: sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO') +' '+ sale.data().date.toDate().toLocaleTimeString('en-US'), ['isDebtPayed']: (sale.data().balance == 0) }
            sales.push(appObj);
        });

    });
    console.log(sales);
    return sales;
}



