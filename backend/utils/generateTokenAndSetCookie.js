import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
            schoolIndex: user.schoolIndex || null, // Optional field for school users
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d' // Token valid for 7 day
        }
    );

    res.cookie('token', token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie valid for 7 days
    });

    return token;
}
