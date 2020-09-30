const utils = require("../utils");

(() => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let code = "";
    code += utils.getRandomElement(letters);
    code += utils.getRandomElement(letters);
    code += utils.getRandomElement(letters);
    code += utils.getRandomElement(letters);
    code += utils.getRandomElement(numbers);
    code += utils.getRandomElement(numbers);
    code += utils.getRandomElement(numbers);
    code += utils.getRandomElement(numbers);

    utils.message("Item code:");
    console.log(code);
})();