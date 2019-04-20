import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { config } from "../config";

/**
 * Shared class for commonly reused code`
 */
class Shared {
    /**
     * Method to hash a string like a passord when a new user is registered
     * @param str
     * @returns a string representing a hash
     */
    static hashString(str: string): string {
        if (!config.hash.salt) throw "Salt is invalid";
        let salt = bcrypt.genSaltSync(parseInt(config.hash.salt));
        return bcrypt.hashSync(str, salt);
    }

    /**
     * Method to compare a string to a hash to tell if they match
     * @param str
     * @param hash
     * @returns true or false
     */
    static compareHash(str: string, hash: string): boolean {
        return bcrypt.compareSync(str, hash);
    }

    static async sendEmail(email: IEmail) {

        let account = { user: "", pass: "" }
        if (config.server.enviroment === "development") {
            account = await nodemailer.createTestAccount();
        } else {
            account = {
                user: config.email.username,
                pass: config.email.password
            }
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"BRTD@gmail.com" <BRTD@egmail.com>',
            to: email.email,
            subject: email.subject,
            html: email.body
        });

        if (config.server.enviroment === "development") {
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

    }

    /**
     * Method designed to escape html in a string
     * @param text
     * @returns an escaped string
     */
    static escapeHtml(text: string): string {
        let map: any = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }
}

export default Shared;

export interface IEmail {
    email: string;
    subject: string;
    body: string;
}