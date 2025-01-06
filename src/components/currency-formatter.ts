export const priceFormatter = (currency: string, price: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumSignificantDigits: 2,
    });

    return formatter.format(price);
};
