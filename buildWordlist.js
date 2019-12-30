const got = require('got');
const fs = require('fs');
const path = require('path');

const REGEX = /([1-6]{5})\s+(.*)/;

const wordlist = {};

got('https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt').text().then(lines => {
    lines.split('\n').forEach(line=> {
        const matches = REGEX.exec(line);
        if(matches) wordlist[matches[1]] = matches[2];
    });
    fs.writeFileSync(path.join(__dirname, 'src','utils','wordlist.json'),JSON.stringify(wordlist));
});
