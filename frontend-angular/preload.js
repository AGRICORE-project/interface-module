const { contextBridge, ipcRenderer } = require('electron')

// White-listed channels.
const ipc = {
    'render': {
        // From render to main.
        'send': [
            'window:minimize', // Channel names
            'window:maximize',
            'window:restore',
            'window:close',
            'window:resize',
            'window:minSize',
            'window:goForward',
            'window:goBack',
        ],
        // From main to render.
        'receive': [],
        // From render to main and back again.
        'sendReceive': []
    }
};

contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods.
    'electronAPI', {
        // From render to main.
        send: (channel, args) => {
            let validChannels = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, args);
            }
        },
        // From main to render.
        receive: (channel, listener) => {
            let validChannels = ipc.render.receive;
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`.
                ipcRenderer.on(channel, (event, ...args) => listener(...args));
            }
        },
        // From render to main and back again.
        invoke: (channel, args) => {
            let validChannels = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
);