

export const collectDocumentKeysInObject = (req, res, next) => {
    req.files.documents = [];
    for (const key in req.files) {
        if (key.startsWith('doc-')) {
            const documentKey = key.slice(4);
            req.files.documents.push({ [documentKey]: req.files[key] });
        }
    }
    next();
};