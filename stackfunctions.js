// hello world!

var StackFunctions = {

    functions: [],

    pushTask: function (func) {
        functions.push(func);
    },

    waitUntil: async function (time, waitingMs) {
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                //console.log('retrying...');
                if (new Date().getTime() - new Date(time) >= waitingMs) {
                    resolve('done successful.');
                    clearInterval(interval);
                };
            }, 1000);
        });
    },

    execute: async function () {
        if (functions.length > 0) {
            //console.log(functions[0]);

            let lastTime = 0;
            if (!localStorage.getItem('pantry_used'))
                localStorage.setItem('pantry_used', new Date().getTime());

            lastTime = parseInt(localStorage.getItem('pantry_used'));

            await waitUntil(lastTime, 2050);

            functions[0]();
            localStorage.setItem('pantry_used', new Date().getTime());

            //console.log('popping');
            functions.shift();
            //console.log(functions);
        }

        setTimeout(execute, 1000);
    }
}
