export function validateEmail(email: string) {
    // https://regexlib.com/REDetails.aspx?regexp_id=26
    const regex = new RegExp(
        /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    );

    return regex.test(email);
};
