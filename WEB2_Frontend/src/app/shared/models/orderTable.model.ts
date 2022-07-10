export class OrderTableModel{
    id: number = 0;
    food: string = "";
    timePosted: string = "";
    timeAccepted: string = "";
    timeDelivered: string = "";
    address: string = "";
    comment: string = "";
    delivered: boolean = false;
    price: number = 0;
    deliverer: string = "";
    customer: string = "";
    status: string = "";
}

///  this.orderTable.push({id: element.id, delivered: element.delivered, comment: element.comment, address: element.address, price: element.price})
    