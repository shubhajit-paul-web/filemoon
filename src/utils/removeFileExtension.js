function removeFileExtension(fileName = "") {
    const lastIndex = fileName?.lastIndexOf(".");

    if (lastIndex === -1) return fileName;

    return fileName?.slice(0, lastIndex);
}

export default removeFileExtension;
