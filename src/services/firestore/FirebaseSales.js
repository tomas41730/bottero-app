import db from '../firebase'
import { actualDate  } from '../firebase';
import { updateProductStock } from './FirebaseProducts';

export async function addSale(sale, customer, total, totalDiscount, totalQuantity, efective, bill, payment, store)
{
    const newDoc = db.collection('sales').doc();
    let saleOrder = [];
    let billNumber = 0;
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
    
    await db.collection('counters').doc('sales').get().then( docSnapshot => 
        {
            if(bill)
            {
                billNumber = docSnapshot.data().billNumber;
            }            
            db.collection('sales').doc(newDoc.id).set(
                {
                    id: newDoc.id,
                    idSale: docSnapshot.data().number,
                    billNumber: billNumber,
                    sale: saleOrder,
                    subtotal: total,
                    total: total - totalDiscount,
                    totalDiscount: totalDiscount,
                    store: store,
                    date: actualDate.FieldValue.serverTimestamp(),
                    shortDate: new Date().toLocaleDateString('es-BO'),
                    customerCi: customer.ci,
                    lastname: customer.lastname,
                    totalQuantity: totalQuantity,
                    efective: efective,
                    exchange: efective - (total - totalDiscount),
                    bill: bill,
                    payment: payment
                });
            console.log(docSnapshot.data().counter);

            if(bill)
            {
                db.collection('counters').doc('sales')
                .update({ 
                        billNumber: actualDate.FieldValue.increment(1),
                        number: actualDate.FieldValue.increment(1)
                    });
            }
            else
            {
                db.collection('counters').doc('sales')
                .update({ 
                        number: actualDate.FieldValue.increment(1)
                    });
            }

        }
    );
    sale.forEach( product => {
        updateProductStock(product, -(product.quantity));
    });
}
export function getSales()
{
    const sales = []
    db.collection('sales').orderBy('date', 'desc').get()
    .then(snapshot => {
        snapshot.docs.forEach(sale => {
            let appObj = {...sale.data(), ['date']: sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO') +' '+ sale.data().date.toDate().toLocaleTimeString('en-US') }
            sales.push(appObj);
        });

    });
    console.log(sales);
    return sales;
}

export function getTotalAmountByDay(date,store)
{
    const sales = []
    db.collection('sales').where('shortDate', '==', date).where('store', '==', store).get()
    .then(snapshot => {
        snapshot.docs.forEach(sale => {
            // let appObj = { total: sale.data().total }
            let appObj = sale.data().total;
            sales.push(appObj);
        });

    });
    console.log('sales: ' + sales)
    return sales;
}
export function getTotalExpensesByDay(date,store)
{
    const expenses = []
    db.collection('expenses').where('date', '==', date).where('store', '==', store).get()
    .then(snapshot => {
        snapshot.docs.forEach(expense => {
            let appObj = expense.data().total;
            expenses.push(appObj);
        });

    });
    console.log('sales: ' + expenses)
    return expenses;
}
export function getEachSale(date, store)
{
    const sales = [];
    db.collection('sales').where('shortDate', '==', date).where('store', '==', store).get()
    .then(snapshot => 
    {
        snapshot.docs.forEach( sale => 
        {
            let appObj = {};
            sale.data().sale.forEach( doc => 
            {
                appObj.store = sale.data().store;
                appObj.date = sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO') +' '+ sale.data().date.toDate().toLocaleTimeString('en-US');
                appObj.shortDate = sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO');
                appObj.customerCi = sale.data().customerCi;
                appObj.lastname = sale.data().lastname;
                appObj.idShoe = doc.idShoe;
                appObj.id = doc.id;
                appObj.discount = doc.discount;
                appObj.subtotal = doc.subtotal;
                appObj.total = doc.subtotal - doc.discount; 
                appObj.price = doc.price;
                appObj.reference = doc.reference;
                appObj.quantity = doc.quantity;
                sales.push(appObj);
                appObj = {};
            });
        });
    });
    return sales;
}

export function getDailyReportByDay(store)
{
    return db.collection('dailyReport').doc(store).get();
}
export function addDailyReport(store, date, dailyReport)
{
    return db.collection('dailyReport').doc(store+'/dates/'+date).set(dailyReport);
}
export function setCashRegister(store, total, description, option)
{
    db.collection('dailyReport').doc(store).get().then( doc => 
    {
        if(doc.exists)
        {
            let income = {
                total: total,
                description: description,
                date: actualDate.Timestamp.now(),
                store: store,
                operation: option
            };
            let history = doc.data().history;
            history.push(income);
            if(option == 'Ingreso')
            {
                
                db.collection('dailyReport').doc(store).update(
                {
                    cash: actualDate.FieldValue.increment(total),
                    history: history
                });
            }
            else
            {
                db.collection('dailyReport').doc(store).update(
                {
                    cash: actualDate.FieldValue.increment(-total),
                    history: history
                });
            }
        }
        else
        {
            let income = {
                total: total,
                description: description,
                date: actualDate.Timestamp.now(),
                store: store,
                operation: option
            };
            let history = [];
            history.push(income)
            if(option == 'Ingreso')
            {
                
                db.collection('dailyReport').doc(store).set(
                {
                    cash: actualDate.FieldValue.increment(total),
                    history: history
                });
            }
            else
            {
                db.collection('dailyReport').doc(store).set(
                {
                    cash: actualDate.FieldValue.increment(-total),
                    history: history
                });
            }
        }
    });
}
export function getEachCashMove(store)
{
    const moves = [];
    db.collection('dailyReport').doc(store).get()
    .then(snapshot => 
    {
        if(snapshot.exists)
        {
            let appObj = {};
            snapshot.data().history.forEach( doc => 
            {
                appObj.store = doc.store;
                appObj.date = doc.date && doc.date.toDate().toLocaleDateString('es-BO') +' '+ doc.date.toDate().toLocaleTimeString('en-US');
                appObj.shortDate = doc.date && doc.date.toDate().toLocaleDateString('es-BO');
                appObj.total = doc.total; 
                appObj.description = doc.description;
                appObj.operation = doc.operation;
                moves.push(appObj);
                appObj = {};
            });
        }
    });
    return moves;
}