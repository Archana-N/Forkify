import uniqId from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqId(),
            count, 
            unit, 
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(element => element.id === id);

        // [2, 4, 8, 16] -> splice(1, 2) -> returns [4, 8], mutates the original array to [2, 16]
        // [2, 4, 8, 16] -> slice(1, 2) -> returns 4, does not mutate the original array, hence original array is [2, 4, 8, 16]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(element => element.id === id).count = newCount;        
    }
}