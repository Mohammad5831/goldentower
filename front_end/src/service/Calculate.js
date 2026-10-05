
export const calculating = (products) => {
    const { tp, top } = products.reduce(
        (acc, item) => {
            acc.tp += Number(item.current_price) * Number(item.quantity);
            acc.top += Number(item.original_price) * Number(item.quantity);
            return acc;
        },
        { tp: 0, top: 0 }
    );

    return { tp, top };
};
