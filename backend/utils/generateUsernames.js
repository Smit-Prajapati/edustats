import { School } from "../models/school.model.js";
import { Teacher } from "../models/teacher.model.js";

export const generateShoolUsername = async () => {
    try {
        const prefix = "school";
        const totalSchools = await School.countDocuments();
        const schoolIndex = totalSchools + 1;
        const username = `${prefix}${schoolIndex}`;
        return { username, schoolIndex };
    } catch (error) {
        console.log("Error generating school username:", error);
        throw new Error("Failed to generate school username");
    }
}


export const generateTeacherUsername = async (firstname, lastname, schoolIndex) => {
    try {
        const baseFirst = firstname.toLowerCase();
        const baseLast = lastname.toLowerCase();
        const maxLastChars = baseLast.length;

        for (let i = 1; i <= maxLastChars; i++) {
            const partialLast = baseLast.substring(0, i);
            const potentialUsername = `${baseFirst}${partialLast}${schoolIndex}`;

            const existing = await Teacher.findOne({ username: potentialUsername });
            if (!existing) {
                return potentialUsername;
            }
        }

        // If all combos taken, fallback to adding random number
        const fallbackUsername = `${baseFirst}${baseLast}${schoolIndex}${Math.floor(Math.random() * 1000)}`;
        return fallbackUsername;

    } catch (error) {
        console.log("Error generating teacher username:", error);
        throw new Error("Failed to generate teacher username");
    }
};
