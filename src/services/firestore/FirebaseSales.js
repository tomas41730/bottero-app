import db from '../firebase'
import { actualDate  } from '../firebase';
import { getProductById, updateProductStock } from './FirebaseProducts';
import { getProductByIdShoeAndStore } from './FirebaseProducts2';

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
export function getTotalAmountByDay(store, date)
{
    return db.collection('sales').where('store', '==', store).where('shortDate', '==', date).orderBy('date', 'desc').get();
}
export function getTotalAmountByDay1(date,store)
{
    const sales = []
    db.collection('sales').where('shortDate', '==', date).where('store', '==', store).get()
    .then(snapshot => {
        snapshot.docs.forEach(sale => 
        {
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
export function getEachSaleByDateStore(date, store)
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
export function getEachSale2()
{
    const sales = [];
    db.collection('sales').orderBy('date','desc').get()
    .then(snapshot => 
    {
        snapshot.docs.forEach( sale => 
        {
            let appObj = {};
            appObj.efective = sale.data().efective;
            appObj.exchange = sale.data().exchange;
            appObj.subtotal = sale.data().subtotal; 
            appObj.payment = sale.data().payment; 
            appObj.total = sale.data().total;  
            appObj.totalDiscount = sale.data().totalDiscount;
            appObj.bill = sale.data().bill;
            sale.data().sale.forEach( doc => 
            {
                getProductById(doc.id).then( snap => 
                {
                    if(snap.exists)
                    {
                        appObj.id = sale.data().id;
                        appObj.size = snap.data().size;
                        appObj.color = snap.data().color;
                        appObj.material = snap.data().material;
                        
                        appObj.store = sale.data().store;
                        appObj.date = sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO') +' '+ sale.data().date.toDate().toLocaleTimeString('en-US');
                        appObj.shortDate = sale.data().date && sale.data().date.toDate().toLocaleDateString('es-BO');
                        appObj.customerCi = sale.data().customerCi;
                        appObj.lastname = sale.data().lastname;
                        appObj.idShoe = doc.idShoe;
                        appObj.idShoeFull = doc.id;
                        appObj.individualDiscount = doc.discount;
                        appObj.individualSubtotal = doc.subtotal;
                        appObj.individualTotal = doc.subtotal - doc.discount; 
                        appObj.price = doc.price;
                        appObj.reference = doc.reference;
                        appObj.quantity = doc.quantity;
                        appObj.sale = sale.data().sale;
                        appObj.idSale = sale.data().idSale.toString();
                        appObj.billNumber = sale.data().billNumber.toString();  
                        sales.push(appObj);
                        appObj = {};
                    }
                });
            });
        });
    });
    return sales;
}
// By Store and date
export function getEachSale1(store, date)
{
    const sales = [];
    db.collection('sales').where('store', '==', store).where('shortDate', '==', date).orderBy('date', 'desc').get().then( snap => 
    {
        if(!snap.empty)
        {
            snap.docs.forEach( doc => 
            {
                doc.data().sale.forEach( item => 
                {   
                    let obj = {};
                    obj = doc.data();
                    obj.date = doc.data().date && doc.data().date.toDate().toLocaleDateString('es-BO') +' '+ doc.data().date.toDate().toLocaleTimeString('en-US');
                    obj.itemId = item.id;
                    obj.idShoe = item.idShoe;
                    obj.itemPrice = item.price;
                    obj.itemDiscount = item.discount;
                    obj.finalPrice = item.price - item.discount;
                    obj.itemQuantity = item.quantity;
                    getProductByIdShoeAndStore(item.idShoe, item.store).then( prod => 
                    {
                        if(prod.exists)
                        {
                            obj.reference = prod.data().reference; 
                            obj.material = prod.data().material;
                            obj.color = prod.data().color;
                            obj.size = prod.data().size;
                            sales.push(obj);
                        }
                        else
                        {
                            console.log('El producto no existe.');
                        }
                    });
                });
            });
        }
    });
    return sales;
}
export function getEachSale(store)
{
    const sales = [];
    db.collection('sales').where('store', '==', store).orderBy('date', 'desc').get().then( snap => 
    {
        if(!snap.empty)
        {
            let cnt = 1;
            snap.docs.forEach( doc => 
            {
                doc.data().sale.forEach( item => 
                {   
                    let obj = {};
                    
                    obj = doc.data();
                    obj.date = doc.data().date && doc.data().date.toDate().toLocaleDateString('es-BO') +' '+ doc.data().date.toDate().toLocaleTimeString('en-US');
                    obj.itemId = item.id;
                    obj.idShoe = item.idShoe;
                    obj.itemPrice = item.price;
                    obj.itemDiscount = item.discount;
                    obj.finalPrice = item.price - item.discount;
                    obj.itemQuantity = item.quantity;
                    obj.idSale = parseInt(doc.data().idSale);
                    obj.idSaleStr = 'V' + doc.data().idSale;
                    getProductByIdShoeAndStore(item.idShoe, store).then( prod => 
                    {
                        
                        if(prod.exists)
                        {
                            // console.log(prod.data());
                            obj.cnt = parseInt(cnt++);
                            obj.reference = prod.data().reference; 
                            obj.material = prod.data().material;
                            obj.color = prod.data().color;
                            obj.size = prod.data().size;
                            obj.condition = prod.data().condition;
                            obj.photo = prod.data().photo;
                            sales.push(obj);
                        }
                        else
                        {
                            console.log('El producto no existe.');
                        }
                    });
                });
            });
        }
    });
    return sales;
}
export function getEachSaleByID(id)
{
    const sales = [];
    db.collection('sales').where('id', '==', id).orderBy('date', 'desc').get().then( snap => 
    {
        if(!snap.empty)
        {
            let cnt = 0;
            snap.docs.forEach( doc => 
            {
                doc.data().sale.forEach( item => 
                {   
                    let obj = {};
                    
                    obj = doc.data();
                    obj.date = doc.data().date && doc.data().date.toDate().toLocaleDateString('es-BO') +' '+ doc.data().date.toDate().toLocaleTimeString('en-US');
                    obj.itemId = item.id;
                    obj.idShoe = item.idShoe;
                    obj.itemPrice = item.price;
                    obj.itemDiscount = item.discount;
                    obj.finalPrice = item.price - item.discount;
                    obj.itemQuantity = item.quantity;
                    
                    getProductByIdShoeAndStore(item.idShoe, item.store).then( prod => 
                    {
                        
                        if(prod.exists)
                        {
                            // console.log(prod.data());
                            obj.cnt = parseInt(cnt++);
                            obj.reference = prod.data().reference; 
                            sales.push(obj);
                        }
                        else
                        {
                            console.log('El producto no existe.');
                        }
                    });
                });
            });
        }
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