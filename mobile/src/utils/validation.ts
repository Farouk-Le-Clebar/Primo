const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim().toLowerCase());
};

export const getPasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasMinLength, hasUppercase, hasSpecial].filter(Boolean).length;

    return {
        score,
        hasMinLength,
        hasUppercase,
        hasSpecial,
    };
};
