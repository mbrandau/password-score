const wordList = require('./wordlist');

// See : https://www.reddit.com/r/crypto/comments/4xe21s/
//
// skip is to make result in this range:
// 0 ≤ result < n* count < 2^31
// (where n is the largest integer that satisfies this equation)
// This makes result % count evenly distributed.
//
// P.S. if (((count - 1) & count) === 0) {...} is optional and for
// when count is a nice binary number (2n). If this if statement is
// removed then it might have to loop a few times. So it saves a
// couple of micro seconds.
function secureRandom(count) {
    const cryptoObj = window.crypto || window.msCrypto;
    const rand = new Uint32Array(1);
    const skip = 0x7fffffff - 0x7fffffff % count;
    let result;

    if (((count - 1) & count) === 0) {
        cryptoObj.getRandomValues(rand);
        return rand[0] & (count - 1)
    }

    do {
        cryptoObj.getRandomValues(rand);
        result = rand[0] & 0x7fffffff
    } while (result >= skip);

    return result % count
}

export function getWords(length) {
    const words = [];

    for (let i = 0; i < length; i += 1) {
        const rollResults = [];

        for (let j = 0; j < 5; j += 1) {
            // roll a 6 sided dice
            rollResults.push(secureRandom(6) + 1)
        }

        words.push(wordList[rollResults.join('')])
    }

    return words
}

export function generatePassword(length = 5) {
    return getWords(length).join(' ');
}