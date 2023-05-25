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
        wattage: 0,
        currentWattage: 0
    },
    timeoutId: null,
    hasDifference: false,
    diffAttribute: null,
    garbageName: null
};

var app = new Vue({
    el: "#app",
    data,
    created: () => {
        console.log("Connecting to server...");

        data.connection = new WebSocket(`ws://${window.location.hostname}:80`);

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

            let diffAttributes = [];
            if (data.run.id) {
                diffAttributes = Object.keys(newRun).filter((key) => {
                    if (key.endsWith("Amount")) {
                        return newRun[key] !== data.run[key];
                    }
                    return false;
                });
            }

            data.run = newRun;

            if (diffAttributes.length > 0) {
                showGarbagePopup(diffAttributes[0]);
            }

            setStopwatch(eventData.startDateTime, eventData.endDateTime, eventData.isRunning)
        };
    },
});

const setStopwatch = (startDateTime, endDateTime, isRunning) => {
    const now = endDateTime ? new Date(endDateTime) : new Date();
    let differenceInSeconds = Math.floor((+now - +new Date(startDateTime)) / 1000);

    //fixed time synchronization problem where server time was in the past, might lead to problems if server time is in the future or js isn't running while run is first started
    differenceInSeconds = differenceInSeconds > 0 ? differenceInSeconds : 0;

    data.run.currentRuntimeInSeconds = differenceInSeconds;

    if (isRunning && !data.timeoutId) {
        let timeInMilliseconds = 0;

        const instance = () => {
            data.run.currentRuntimeInSeconds++;
            timeInMilliseconds += 1000;

            const differenceInMilliseconds = (+new Date() - +now) - timeInMilliseconds;

            data.timeoutId = setTimeout(instance, (1000 - differenceInMilliseconds));
        }

        data.timeoutId = setTimeout(instance, 1000);
    } else if (!isRunning) {
        clearTimeout(data.timeoutId);
        data.timeoutId = null;
    }
}

const showGarbagePopup = (attribute) => {
    const garbageNames = {
        bottleCapAmount: "Kronkorken",
        cigaretteAmount: "Zigarette",
        plasticCapAmount: "PET-Deckel",
        keyAmount: "Schlüssel",
        coinAmount: "Münze",
        ringAmount: "Ring"
    };

    data.hasDifference = true;
    data.diffAttribute = attribute;
    data.garbageName = garbageNames[attribute];

    setTimeout(() => {
        data.hasDifference = false;
        data.diffAttribute = null;
        data.garbageName = null;
    }, 2500);
};