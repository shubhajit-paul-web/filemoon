function removeWhiteSpaces(text) {
    if (typeof text !== "string") return text;

    return text?.replace(/\s+/g, " ").trim();
}

export default removeWhiteSpaces;
