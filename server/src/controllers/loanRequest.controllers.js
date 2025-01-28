import Request from "../models/loanRequest.models.js"

const getCurrentLoanRequest = async (req,res) => {
    const user = req.user;
    try {
        const loanRequest = await Request.findOne({userId: user._id});
        if (!loanRequest) {
            return res.status(404).json({
                message: "Loan request not found!"
            })
        }
        return res.status(200).json(loanRequest);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export {getCurrentLoanRequest};