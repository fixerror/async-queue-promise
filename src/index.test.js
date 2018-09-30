import Queue from './index';

const delay = (time, value) => () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(value);
    }, time);
});

describe('Queue', () => {
    test('should be instantiated by defaults wihout errors', () => {
        expect(() => (new Queue())).not.toThrow();
    });

    test('Queue method add', async () => {
        jest.setTimeout(15000);
        const instance = new Queue();
        let result5;
        setTimeout(() => {
            result5 = instance.add(delay(500, 'time 5'));
            expect(instance.pending).toEqual(5);
        }, 500);
        const result1 = instance.add(delay(3000, 'time 1'));
        expect(instance.pending).toEqual(1);
        const result2 = instance.add(delay(1000, 'time 2'));
        expect(instance.pending).toEqual(2);
        const result3 = instance.add(delay(2000, 'time 3'));
        expect(instance.pending).toEqual(3);
        const result4 = instance.add(delay(1000, 'time 4'));
        expect(instance.pending).toEqual(4);
        expect(await result1).toEqual('time 1');
        expect(instance.pending).toEqual(0);
        expect(await result2).toEqual('time 2');
        expect(await result3).toEqual('time 3');
        expect(await result4).toEqual('time 4');
        expect(await result5).toEqual('time 5');
    });

    test('Queue method add maxPending = 1', async () => {
        jest.setTimeout(15000);
        const instance = new Queue({ maxPending: 1 });
        let result5;
        setTimeout(() => {
            result5 = instance.add(delay(500, 'time 5'));
            expect(instance.pending).toEqual(1);
            expect(instance.length).toEqual(4);
        }, 500);
        const result1 = instance.add(delay(3000, 'time 1'));
        expect(instance.pending).toEqual(1);
        const result2 = instance.add(delay(1000, 'time 2'));
        expect(instance.pending).toEqual(1);
        const result3 = instance.add(delay(2000, 'time 3'));
        expect(instance.pending).toEqual(1);
        const result4 = instance.add(delay(1000, 'time 4'));
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(3);
        expect(await result1).toEqual('time 1');
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(3);
        expect(await result2).toEqual('time 2');
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(2);
        expect(await result3).toEqual('time 3');
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(1);
        expect(await result4).toEqual('time 4');
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(0);
        expect(await result5).toEqual('time 5');
        expect(instance.pending).toEqual(0);
    });

    test('Queue method add maxQueued = 1', async () => {
        jest.setTimeout(15000);
        const instance = new Queue({ maxQueued: 1 });
        let result5;
        setTimeout(() => {
            result5 = instance.add(delay(500, 'time 5'));
            expect(instance.pending).toEqual(5);
            expect(instance.length).toEqual(0);
        }, 500);
        const result1 = instance.add(delay(3000, 'time 1'));
        expect(instance.pending).toEqual(1);
        const result2 = instance.add(delay(1000, 'time 2'));
        expect(instance.pending).toEqual(2);
        const result3 = instance.add(delay(2000, 'time 3'));
        expect(instance.pending).toEqual(3);
        const result4 = instance.add(delay(1000, 'time 4'));
        expect(instance.pending).toEqual(4);
        expect(instance.length).toEqual(0);
        expect(await result1).toEqual('time 1');
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(await result2).toEqual('time 2');
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(await result3).toEqual('time 3');
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(await result4).toEqual('time 4');
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(await result5).toEqual('time 5');
        expect(instance.pending).toEqual(0);
    });

    test('Queue method add maxQueued = 1 and maxPending = 1', async () => {
        jest.setTimeout(15000);
        const instance = new Queue({ maxPending: 1, maxQueued: 1 });
        let result5;
        setTimeout(async () => {
            try {
                result5 = await instance.add(delay(500, 'time 5'));
                expect(result5).toEqual(false);
            } catch (e) {
                expect(e.toString()).toEqual('Error: Queue limit');
            }
            expect(instance.pending).toEqual(1);
            expect(instance.length).toEqual(1);
        }, 500);
        const result1 = instance.add(delay(3000, 'time 1'));
        expect(instance.pending).toEqual(1);
        const result2 = instance.add(delay(1000, 'time 2'));
        expect(instance.pending).toEqual(1);
        let result3;
        try {
            result3 = await instance.add(delay(2000, 'time 3'));
            expect(result3).toEqual(false);
        } catch (e) {
            expect(e.toString()).toEqual('Error: Queue limit');
        }

        expect(instance.pending).toEqual(1);
        let result4;
        try {
            result4 = await instance.add(delay(1000, 'time 4'));
            expect(result3).toEqual(false);
        } catch (e) {
            expect(e.toString()).toEqual('Error: Queue limit');
        }
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(1);
        expect(await result1).toEqual('time 1');
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(0);
        expect(await result2).toEqual('time 2');
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(result3).toEqual(undefined);
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(result4).toEqual(undefined);
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(result5).toEqual(undefined);
        expect(instance.pending).toEqual(0);
    });


    test('Queue method add test reject', async () => {
        jest.setTimeout(15000);
        const instance = new Queue();
        const result1 = instance.add(delay(3000, 'time 1'));
        expect(instance.pending).toEqual(1);
        let result2;
        try {
            result2 = await instance.add(delay(1000, new Error('Test reject')));
        } catch (e) {
            expect(e.toString()).toEqual('Error: Test reject');
        }
        expect(instance.pending).toEqual(1);
        expect(instance.length).toEqual(0);
        expect(await result1).toEqual('time 1');
        expect(instance.pending).toEqual(0);
        expect(instance.length).toEqual(0);
        expect(result2.toString()).toEqual('Error: Test reject');
    });

    test('Queue method add test not add other value', async () => {
        jest.setTimeout(15000);
        const instance = new Queue();
        const result1 = instance.add(delay(3000, 'time 1'));
        const result2 = await instance.add(_ => 'time 2');
        const result3 = instance.add(delay(1000, 'time 3'));
        const result4 = await instance.add('time 4');
        const result5 = await instance.add(Promise.resolve('time 5'));
        try {
            await instance.add(_ => new Error('time 6'));
        } catch (e) {
            expect(e.toString()).toEqual('time 6');
        }
        expect(await result1).toEqual('time 1');
        expect(await result2).toEqual('time 2');
        expect(await result3).toEqual('time 3');
        expect(await result4).toEqual('time 4');
        expect(await result5).toEqual('time 5');
    });
});
