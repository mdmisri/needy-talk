import User from "../models/User";

router.get('/admins', async (req, res) => {
    const { gender } = req.query;

    try {
        const admins = await User.find({ isAdmin: true, gender });
        res.status(200).json(admins);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});