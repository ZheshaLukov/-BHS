class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.value = null;
        this.error = null;
        this.callbacks = [];
    
        const resolve = value => {
            if (this.status === 'pending') {
            this.status = 'fulfilled';
            this.value = value;
            this.callbacks.forEach(callback => callback.onFulfilled(value));
            }
        };
    
        const reject = error => {
            if (this.status === 'pending') {
            this.status = 'rejected';
            this.error = error;
            this.callbacks.forEach(callback => callback.onRejected(error));
            }
        };
    
        try {
            executor(resolve, reject);
        } 
        catch(error) {
            reject(error);
        }
    }
    
    then(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            const callback = {
                onFulfilled: value => {
                    try {
                        if (typeof onFulfilled === 'function') {
                            resolve(onFulfilled(value));
                        } 
                        else {
                            resolve(value);
                        }
                    } 
                    catch (error) {
                        reject(error);
                    }
                },
                onRejected: error => {
                    try {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected(error));
                        }
                        else {
                            reject(error);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                },
            };
    
            if (this.status === 'pending') {
                this.callbacks.push(callback);
            } 
            else if (this.status === 'fulfilled') {
                callback.onFulfilled(this.value);
            } 
            else if (this.status === 'rejected') {
                callback.onRejected(this.error);
            }
        });
    }
    
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    
    static all(promises) {
        return new Promise((resolve, reject) => {
            const results = [];
            let completedPromises = 0;
    
            const checkCompletion = () => {
                if (completedPromises === promises.length) {
                    resolve(results);
                }
            };
    
            promises.forEach((promise, index) => {
                promise.then(result => {
                    results[index] = result;
                    completedPromises++;
                    checkCompletion();
                }).catch(error => { reject(error);});
            });
        });
    }
}

const promise1 = new Promise((resolve, reject) => setTimeout(() => resolve(1), 100));
const promise2 = new Promise((resolve, reject) => setTimeout(() => resolve(2), 200));
const promise3 = new Promise((resolve, reject) => setTimeout(() => resolve(3), 300));
const promise4rejected = new Promise((resolve, reject) => setTimeout(() => reject('reject'), 500))

Promise.all([promise1, promise2, promise3]).then(results => {
    console.log('Success:', results); // [1, 2, 3]
    })
    .catch(error => {
    console.log('Error:', error);
    });

Promise.all([promise1, promise2, promise4rejected]).then(results => {
    console.log('Success:', results);
    })
    .catch(error => {
    console.log('Error:', error);
    });