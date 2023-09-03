export function isSupported(filetype) {
    const supportedFileTypes = [
        "ai",
        "avi",
        "css",
        "csv",
        "dbf",
        "doc",
        "dwg",
        "exe",
        "file",
        "fla",
        "html",
        "iso",
        "js",
        "json",
        "mp3",
        "mp4",
        "pdf",
        "png",
        "ppt",
        "psd",
        "rtf",
        "svg",
        "txt",
        "xls",
        "xml",
        "zip"
    ];
    return supportedFileTypes.includes(filetype);
}

export default isSupported;