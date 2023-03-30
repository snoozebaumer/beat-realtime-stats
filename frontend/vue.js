const data = {
    connection: null,
    run: {
        id: null,
        startDateTime: null,
        endDateTime: null,
        isRunning: false,
        currentRuntimeInSeconds: 0,
        status: "Ausser Betrieb",
        bottleCapAmount: 0,
        cigaretteAmount: 0,
        plasticCapAmount: 0,
        keyAmount: 0,
        coinAmount: 0,
        ringAmount: 0,
    },
    intervalId: null
};

var app = new Vue({
    el: "#app",
    data,
    created: () => {
        console.log("Connecting to server...");

        data.connection = new WebSocket(`ws://${window.location.hostname}:8080`);

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

            setStopwatch(eventData.startDateTime, eventData.endDateTime, eventData.isRunning)
        };
    },
});

const setStopwatch = (startDateTime, endDateTime, isRunning) => {
    const now = endDateTime ? new Date(endDateTime) : new Date()
    const differenceInSeconds = Math.floor((+now - +new Date(startDateTime)) / 1000)

    data.run.currentRuntimeInSeconds = differenceInSeconds

    if (isRunning && !data.intervalId) {
        data.intervalId = setInterval(() => data.run.currentRuntimeInSeconds++, 1000)
    } else if (!isRunning) {
        clearInterval(data.intervalId)
        data.intervalId = null
    }
}
