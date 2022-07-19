export const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };

    return adjDescriptor;
};
