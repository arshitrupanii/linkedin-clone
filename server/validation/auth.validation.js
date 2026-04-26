import { body } from "express-validator";
import { validation } from "../lib/validation.js"

export const signupValidation = validation(
    [
        body("name")
            .trim()
            .notEmpty().withMessage("Name is required")
            .isLength({ min: 3, max: 50 })
            .withMessage("Name must be 3-50 characters"),

        body("username")
            .trim()
            .toLowerCase()
            .notEmpty().withMessage("Username is required")
            .isLength({ min: 3, max: 30 })
            .withMessage("Username must be 3-30 characters")
            .matches(/^[a-z0-9_]+$/)
            .withMessage("Username can contain lowercase letters, numbers and underscores"),

        body("email")
            .notEmpty().withMessage("Email is required")
            .trim()
            .toLowerCase()
            .isEmail()
            .withMessage("Invalid email format"),

        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
            .withMessage("Password must contain uppercase, lowercase, number and special character")
    ]
);

export const loginValidation = validation(
    [
        body("username")
            .notEmpty().withMessage("Username is required")
            .trim()
            .toLowerCase()
            .isLength({ min: 3, max: 30 })
            .withMessage("Username must be 3-30 characters"),


        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")

            .matches(/[a-z]/).withMessage("Password must contain lowercase letter")
            .matches(/[A-Z]/).withMessage("Password must contain uppercase letter")
            .matches(/\d/).withMessage("Password must contain number")
            .matches(/[@$!%*?&]/).withMessage("Password must contain special character")
    ]
);
