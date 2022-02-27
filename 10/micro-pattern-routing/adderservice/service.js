module.exports = service;

function service() {
    function add(args, cb) {
        const { first, second } = args;
        const result = (parseInt(first, 10) + parseInt(second, 10)).toString();
        cb(null, { result });
    }

    return { add };
}
