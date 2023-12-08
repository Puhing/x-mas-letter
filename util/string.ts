export const numToSSColumn = (num: number) => {
    var s = "",
        t;

    while (num > 0) {
        t = (num - 1) % 26;
        s = String.fromCharCode(65 + t) + s;
        num = ((num - t) / 26) | 0;
    }
    return s || undefined;
};

export const numCommas = (num: number | string) => {
    if (typeof num == "number") {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

export const regexEmail = (email: string) => {
    let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (reg.exec(email) != null) {
        return true;
    }
    return false;
};
