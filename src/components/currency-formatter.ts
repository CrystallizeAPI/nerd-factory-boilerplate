export const priceFormatter = (currency?: string, price?: number) => {
    if (price === undefined) {
        return '-';
    }
    if (!currency) {
        return price;
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumSignificantDigits: 2,
    });

    return formatter.format(price || 0);
};
