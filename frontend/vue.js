const data = {
    connection: null,
    run: {
        id: null,
        startDateTime: null,
        endDateTime: null,
        currentRunTime: '-',
        isRunning: false,
        status: "Ausser Betrieb",
        bottleCapAmount: 0,
        cigaretteAmount: 0,
        plasticCapAmount: 0,
        keyAmount: 0,
        coinAmount: 0,
        ringAmount: 0,
    },

};

var app = new Vue({
    el: "#app",
    data,
    created: () => {
        console.log("Connecting to server...");

        data.connection = new WebSocket(`ws://${window.location.hostname}:3000`);

        data.connection.onopen = (event) => {
            console.log("Successfully connected to server");
        };

        data.connection.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            const newRun = {
                ...data.run,
                ...eventData,
                status: eventData.isRunning ? "In Betrieb" : "Ausser Betrieb",
            };
            data.run = newRun;
        };
    },
});