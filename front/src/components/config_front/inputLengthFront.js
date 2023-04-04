export const inputLengthUp = (input, length = 63) => {
    return input.length < length
}

export const inputLengthDown = (input, length = 0) => {
    return input.trim().length != length
}