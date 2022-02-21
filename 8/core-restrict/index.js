module.exports = function(name) {
    require.cache[name] = {};
    Object.defineProperty(require.cache[name], 'exports', {
        get: () => { throw Error(`The ${name} module is restricted`) }
    })
}