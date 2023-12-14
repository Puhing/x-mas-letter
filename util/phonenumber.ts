import MySQL, { MySQLTransaction } from "../MySQL";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export function regexPhoneNumber(phoneNum) {
    return isValidPhoneNumber(phoneNum);
}

export function getPurePhoneNumber(phoneNum) {
    let res = parsePhoneNumber(phoneNum);
    if (res.country) {
        return res.number;
    }
    return;
}

export function getInfoPhoneNumber(phoneNum) {
    let res = parsePhoneNumber(phoneNum);
    return {
        country: res.country,
        countryCode: res.countryCallingCode,
        number: res.number,
    };
}

export const CheckCBTUser = async (db: MySQL | MySQLTransaction, phoneNumber: string) => {
    let isValid = isValidPhoneNumber(phoneNumber);
    if (isValid) {
        let res = parsePhoneNumber(phoneNumber);
        const find = await db.one(`SELECT * FROM TB_CBT_USERS WHERE phoneNumber = ?`, [res.number]);
        console.log(res.number, find !== undefined);
        return find !== undefined;
    }

    return false;
};
