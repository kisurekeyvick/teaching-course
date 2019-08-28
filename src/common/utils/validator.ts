/**
 * 手机号验证
 * @param value
 */
const validTelePhone = (value: string, required: boolean = true): boolean => {
    if (!value && !required)
        return true;

    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    const isValid = reg.test(value);
    return isValid;
}

/**
 * 邮箱验证
 * @param value
 */
const vaildEmail = (value: string, required: boolean = true): boolean => {
    if (!value && !required)
        return true;

    const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/g;
    const isValid = reg.test(value);
    return isValid;
}

export {
    validTelePhone,
    vaildEmail
};
