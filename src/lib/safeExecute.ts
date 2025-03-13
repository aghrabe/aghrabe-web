export default async function safeExecute<T, E>(
    fn: () => Promise<T>,
    errorNormalizer: (error: unknown) => E,
): Promise<[T | null, E | null]> {
    try {
        const result = await fn();
        return [result, null];
    } catch (err) {
        return [null, errorNormalizer(err)];
    }
}
