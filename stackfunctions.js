// hello world!

var StackFunctions = {
    taskLists: [],

    pushTask: function (func) {
        StackFunctions.taskLists.push(func);
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
        if (StackFunctions.taskLists.length > 0) {
            if (StackFunctions.taskLists[0]) {
                let lastTime = 0;
                if (!localStorage.getItem('pantry_used'))
                    localStorage.setItem('pantry_used', new Date().getTime());

                lastTime = parseInt(localStorage.getItem('pantry_used'));

                await StackFunctions.waitUntil(lastTime, 2050);

                StackFunctions.taskLists[0]();
                localStorage.setItem('pantry_used', new Date().getTime());

                //console.log('popping');
                StackFunctions.taskLists.shift();
                //console.log(functions);
            }
        }

        setTimeout(StackFunctions.execute, 1000);
    }
}
