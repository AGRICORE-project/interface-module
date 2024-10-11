export type ConnectionList = {
    interfaceApi: ConnectionState,
    abmApi: ConnectionState
}

export type ConnectionState = {
    message: string,
    errorMessage: string | null,
    connected: boolean,
    class: string
}

export type ApiIdentifiers = keyof ConnectionList;
