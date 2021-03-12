const requiredValidator = (val: string, name: string) => {
    console.log(name);
    if (!val) {
        return [`Enter ${name.replace("_", " ")}`];
    }

    return [];
};

const passwordMatchedValidator = (val: string, name: string, formData: any) => {
    if (val !== formData.password) {
        return ["Must match password"];
    }

    return [];
};

export {requiredValidator, passwordMatchedValidator};
