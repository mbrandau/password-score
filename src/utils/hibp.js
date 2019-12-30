import * as sha1 from "sha1";

const cache = [];

export const haveIBeenPwned = async password => {
    const hash = sha1(password).toUpperCase();
    if(cache.indexOf(hash)>=0)return true;
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hash.substr(0,5)}`);
    const text = await response.text();
    const pwned = text.indexOf(hash.substr(5)) >= 0;
    if(pwned)cache.push(hash);
    return pwned;
};