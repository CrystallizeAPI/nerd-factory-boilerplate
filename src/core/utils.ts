
export const removeNullValue = <T>(obj: T): T | undefined => {
    if (obj === null || obj === undefined) {
        return undefined
    }

    if (Array.isArray(obj)) {
        const filtered = obj.map(removeNullValue).filter((val) => val !== undefined)
        return filtered.length === 0 ? ([] as T) : (filtered as unknown as T)
    }

    if (obj instanceof Date) {
        return obj
    }

    if (typeof obj === 'object') {
        const filtered: { [key: string]: unknown } = {}
        let empty = true
        for (const key in obj) {
            const val = removeNullValue(obj[key])
            if (val !== undefined) {
                empty = false
                filtered[key] = val
            }
        }
        return empty ? undefined : (filtered as unknown as T)
    }

    return obj
}
