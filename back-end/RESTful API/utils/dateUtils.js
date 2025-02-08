const convertDateFormat = (dateString) => {
    if (!/^\d{8}$/.test(dateString)) {
        throw new Error("Invalid date format.");
    }

    const year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6) - 1;
    let day = parseInt(dateString.substring(6, 8), 10) + 1;

    const date = new Date(year, month, day);
    return date.toISOString();
};

module.exports = { convertDateFormat };
