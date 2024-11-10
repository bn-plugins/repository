import { existsSync } from "fs";
import { writeFile } from "fs/promises";

interface Form {
    "id": string;
    "commit": string;
    "git-url"?: string;
    "command"?: string;
    "dist-target"?: string;
}

const FORM: Form = JSON.parse(Bun.env.FORM!);
const AUTHOR_ID = Bun.env.AUTHOR_ID!;

async function writePlugin(existing?) {
    try {
        const required = ["id", "commit"]
        const requiredForNew = [...required, "git-url", "command"];

        // Validate required fields
        for (const key of required) {
            if (!existing?.[key]) throw new Error(`Missing required field: ${key}`);
        }

        for (const key of requiredForNew) {
            if (!FORM[key]) throw new Error(`Missing required field for new plugins: ${key}`);
        }

        const data = Object.assign(existing ?? {}, {
            id: FORM.id,
            repository: FORM["git-url"],
            commit: FORM.commit,
            command: FORM.command,
            distFolder: FORM["dist-target"] || undefined,
            authorId: AUTHOR_ID
        });

        await writeFile(`./plugins/${FORM.id}.json`, JSON.stringify(data, null, 2));
        console.log(`File saved successfully: ./plugins/${FORM.id}.json`);
    } catch (error) {
        console.error("Error saving file:", error);
        process.exit(1);
    }
}

if (existsSync(`./plugins/${FORM.id}.json`)) {
    await writePlugin(await Bun.file(`./plugins/${FORM.id}.json`).json());
} else {
    await writePlugin();
}