export interface EnvironmentVariables {
    BLAISE_API_URL: string
    PROJECT_ID: string
    SERVER_PARK: string
    CATI_DASHBOARD_URL: string
}

export function getEnvironmentVariables(): EnvironmentVariables {
    let {PROJECT_ID, BLAISE_API_URL, SERVER_PARK, VM_EXTERNAL_WEB_URL} = process.env;
    const CATI_DASHBOARD_URL = "https://" + VM_EXTERNAL_WEB_URL + "/Blaise";

    if (BLAISE_API_URL === undefined) {
        console.error("BLAISE_API_URL environment variable has not been set");
        BLAISE_API_URL = "ENV_VAR_NOT_SET";
    }

    if (VM_EXTERNAL_WEB_URL === undefined) {
        console.error("VM_EXTERNAL_WEB_URL environment variable has not been set");
        VM_EXTERNAL_WEB_URL = "VM_EXTERNAL_WEB_URL";
    }

    if (PROJECT_ID === undefined) {
        console.error("PROJECT_ID environment variable has not been set");
        PROJECT_ID = "ENV_VAR_NOT_SET";
    }

    if (SERVER_PARK === undefined) {
        console.error("SERVER_PARK environment variable has not been set");
        SERVER_PARK = "ENV_VAR_NOT_SET";
    }
    return {BLAISE_API_URL, PROJECT_ID, SERVER_PARK, CATI_DASHBOARD_URL};
}
