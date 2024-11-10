import { existsSync } from "fs";
import { writeFile } from "fs/promises";

interface Form {
    id: string;
    "git-url": string;
    commit: string;
    command: string;
    "dist-target"?: string;
}

const FORM: Form = JSON.parse(Bun.env.FORM!);
const AUTHOR_ID = Bun.env.AUTHOR_ID!;

async function writePlugin(existing?) {
    try {
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
    }
}

if (existsSync(`./plugins/${FORM.id}.json`)) {
    await writePlugin(require(`./plugins/${FORM.id}.json`));
} else {
    await writePlugin();
}