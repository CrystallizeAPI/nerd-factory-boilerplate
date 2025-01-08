export const removeNullValue = <T>(obj: T): T | undefined => {
    if (obj === null || obj === undefined) {
        return undefined;
    }

    if (Array.isArray(obj)) {
        const filtered = obj.map(removeNullValue).filter((val) => val !== undefined);
        return filtered.length === 0 ? ([] as T) : (filtered as unknown as T);
    }

    if (obj instanceof Date) {
        return obj;
    }

    if (typeof obj === 'object') {
        const filtered: { [key: string]: unknown } = {};
        let empty = true;
        for (const key in obj) {
            const val = removeNullValue(obj[key]);
            if (val !== undefined) {
                empty = false;
                filtered[key] = val;
            }
        }
        return empty ? undefined : (filtered as unknown as T);
    }

    return obj;
};

export const encodeBase64Url = (string: string) => {
    const encoded = btoa(string);
    const urlSafeEncoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return urlSafeEncoded;
};

export const decodeBase64Url = (base64Url: string) => {
    const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), '=');

    return atob(base64);
};
