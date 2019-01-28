export const toCurrency = (n, nullValue) => {
    if (!n || !Number.isFinite(parseFloat(n))) return nullValue || "0,00";
    let f = parseFloat(n).toFixed(2);
    let s = f.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return s;
};

export const toNumber = (c) => {
    if (!c) return 0;
    let n = (parseFloat(c.toString().split(".").join("").split(",").join(".")).toFixed(2)) / 1;
    if (!Number.isFinite(n)) return 0;
    return n;
};

export const validUrl = (str) => {
    if ((str) && (!str.match(/^[a-zA-Z]+:\/\//))) {
        str = "http://" + str;
    }
    return str;
};