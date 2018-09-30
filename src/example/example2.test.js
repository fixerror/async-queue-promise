import Queue from '../../dist/async-queue-promise.umd';

const delay = (time, value) => () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(value);
    }, time);
});

describe('Example2', () => {
    test('Example2 test', (done) => {
        jest.setTimeout(15000);
        const run = async () => {
            const instance = new Queue();
            const result1 = instance.add(delay(3000, 'time 1'));
            const result2 = await instance.add(_ => 'time 2');
            const result3 = instance.add(delay(1000, 'time 3'));
            const result4 = await instance.add('time 4');
            const result5 = await instance.add(Promise.resolve('time 5'));
            try {
                await instance.add(_ => new Error('time 6'));
            } catch (e) {
                console.log(e.toString());
            }
            console.log(await result1);
            console.log(await result2);
            console.log(await result3);
            console.log(await result4);
            console.log(await result5);
            done();
        };

        run();
    });
});
