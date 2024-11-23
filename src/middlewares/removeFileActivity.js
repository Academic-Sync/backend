module.exports = async (req, res, next) => {
    try {
        let { activity_id, file_name } = req.body;

        if(!activity_id || !file_name)
            return res.status(400).json({error: 'Insira todos os campos'});

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};  
    