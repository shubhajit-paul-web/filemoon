export const userNameFormatter = (name = "") => {
    return name
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1)?.trim())
        ?.join(" ");
};

export const debounce = (fn, delay = 500) => {
    let timer;

    return (...a) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...a);
        }, delay);
    };
};
