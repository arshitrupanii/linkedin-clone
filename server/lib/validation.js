import { validationResult } from "express-validator";

export const validation = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((rule) => rule.run(req)));

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        next();
    };
};