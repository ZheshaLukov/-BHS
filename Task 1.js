class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
        return this; // для поддержки chaining
    }
    
    unsubscribe(eventName, callback) {
        if (!this.events[eventName]) {
            return this; // ничего не делаем если события нет
        }
        const index = this.events[eventName].indexOf(callback);
        if (index >= 0) {
            this.events[eventName].splice(index, 1);
            }
        return this; // для поддержки chaining
    }
    
    emit(eventName, ...args) {
        const eventCallbacks = this.events[eventName];
        if (eventCallbacks) {
            eventCallbacks.forEach(callback => {callback(...args);});
        }
        return this; // для поддержки chaining
    }
}

const eventEmitter = new EventEmitter()
function f1() {
    console.log('hello,')
}
function f2() {
    console.log('world')
}
function f3() {
    console.log('some output')
}
eventEmitter.subscribe('event1', f1).subscribe('event1', f2).subscribe('event2', f3).emit('event1') // вывод: hello, world
eventEmitter.emit('event2') // вывод: some output
eventEmitter.unsubscribe('event1', f1).emit('event1') // вывод: world
