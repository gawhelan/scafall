var namePrefix = 'scafall-';
var nameRegex = new RegExp('^' + namePrefix);

function getPackageName(name) {
    return nameRegex.test(name) ? name : namePrefix + name;
}

function getGeneratorName(name) {
    return name.replace(nameRegex, '');
}

function isPackageName(name) {
    return nameRegex.test(name);
}

module.exports = {
    getPackageName: getPackageName,
    getGeneratorName: getGeneratorName,
    isPackageName: isPackageName,
};
