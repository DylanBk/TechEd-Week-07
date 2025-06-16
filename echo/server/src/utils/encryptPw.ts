import bcrypt from 'bcrypt';

const encryptPw = async (pw: string) => {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds) as string;
    const hash = await bcrypt.hashSync(pw, salt) as string;

    return hash as string;
};

export default encryptPw;