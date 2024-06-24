export default {
    check,
    lookup,
};

let elements;
let symbols = {}; // Initialize symbols as an object

async function loadPeriodicTable() {
    const response = await fetch("periodic-table.json");
    elements = await response.json();
    for (const element of elements) {
        symbols[element.symbol.toLowerCase()] = element;
    }
}

// Call loadPeriodicTable immediately to ensure it's ready
loadPeriodicTable(); 

function findCandidates(inputWord) {
    const oneLetterSymbols = [];
    const twoLetterSymbols = [];

    for (let i = 0; i < inputWord.length; i++) {
        const one = inputWord[i].toLowerCase(); // Convert to lowercase for case-insensitivity
        const two = inputWord.slice(i, i + 2).toLowerCase(); 

        if (one in symbols && !oneLetterSymbols.includes(one)) {
            oneLetterSymbols.push(one);
        }

        if (two in symbols && !twoLetterSymbols.includes(two)) {
            twoLetterSymbols.push(two);
        }
    }
    
    return [...twoLetterSymbols, ...oneLetterSymbols];
}

function spellWord(candidates, charsLeft) {
    if (charsLeft.length === 0) {
        return [];
    }

    for (const candidate of candidates) {
        if (charsLeft.startsWith(candidate)) { // More concise check
            const rest = charsLeft.slice(candidate.length);
            const result = spellWord(candidates, rest);
            if (result.length > 0 || rest.length === 0) { // Handle empty rest
                return [candidate, ...result];
            }
        }
    }
    
    return []; // No valid spelling found
}

function check(inputWord) {
    const candidates = findCandidates(inputWord);
    return spellWord(candidates, inputWord.toLowerCase()); 
}

function lookup(elementSymbol) {
    return symbols[elementSymbol.toLowerCase()];
}