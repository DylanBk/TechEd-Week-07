import bcrypt from 'bcrypt';

const checkPw = async (pw: string, userPw: string) => {
    const res = await bcrypt.compare(pw, userPw);

    return res;
};

export default checkPw;