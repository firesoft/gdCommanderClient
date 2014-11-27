function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomString(howMany, chars) {
    chars = chars || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var value = [];
    for (var i=0; i<howMany; i++) {
    	value.push(chars[randomInt(0, chars.length-1)]);
    }
    return value.join('');
}

module.exports.randomString = randomString;