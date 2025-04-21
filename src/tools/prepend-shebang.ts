import * as fs from 'fs-extra';

const distPath = 'dist/cli/index.js';
const shebang = '#!/usr/bin/env node\n';

async function prependShebang() {

    try {

        const existingContent = await fs.readFile(distPath, 'utf8');
        await fs.writeFile(distPath, shebang + existingContent);
        console.log(`Shebang added to ${distPath}`);

    } catch (error: any) {

        console.error(`Error adding shebang to ${distPath}:`, error.message);
        process.exit(1); // Exit with an error code
    }
}

prependShebang();