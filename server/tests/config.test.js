import {getEnvironmentVariables} from "../Config";

describe("Config setup", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should return the correct environment variables", () => {
        const {PROJECT_ID, BLAISE_API_URL, SERVER_PARK, CATI_DASHBOARD_URL} = getEnvironmentVariables();


        expect(PROJECT_ID).toBe("mock-project");
        expect(SERVER_PARK).toBe("mock-server-park");
        expect(BLAISE_API_URL).toBe("mock");
        expect(CATI_DASHBOARD_URL).toBe("https://external-web-url/Blaise");
    });

    it("should return variables with default string if variables are not defined", () => {
        process.env = Object.assign({
            PROJECT_ID: undefined,
            BLAISE_API_URL: undefined,
            SERVER_PARK: undefined,
            CATI_DASHBOARD_URL: undefined
        });

        const {PROJECT_ID, BLAISE_API_URL, SERVER_PARK, CATI_DASHBOARD_URL} = getEnvironmentVariables();


        expect(PROJECT_ID).toBe("ENV_VAR_NOT_SET");
        expect(SERVER_PARK).toBe("ENV_VAR_NOT_SET");
        expect(BLAISE_API_URL).toBe("ENV_VAR_NOT_SET");
        expect(CATI_DASHBOARD_URL).toBe("https://undefined/Blaise");
    });
});
