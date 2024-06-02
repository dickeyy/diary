import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const policyDir = path.join(process.cwd(), "policies");

export const getPolicyData = async (id: string): Promise<any> => {
    try {
        const fullPath = path.join(policyDir, `${id}.md`);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        const matterResult = matter(fileContents);
        const processedContent = await remark().use(html).process(matterResult.content);
        const contentHtml = processedContent.toString();

        return {
            id,
            contentHtml
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};
