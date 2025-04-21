import { execSync } from "child_process";

import * as fs from "fs-extra";
import * as path from 'path';

function executeCmd(command: string, loading: boolean = true) {

    process.stdout.write(loading ? "." : "");

    try {

        execSync(command, { stdio: loading ? "pipe" : "inherit" });

    } catch (error) {

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.error(`Error executing: ${command}`, error);

        throw error;
    }
}

function copyTemplate(file: string, pathRoute: string) {

    fs.copySync(path.resolve(__dirname,
        '../../templates/' + file + '.t'),
        pathRoute + "/" + file);
}

export async function initCommand(projectName: string) {

    // Logic to set up a new project structure

    try {

        const projectPath = path.resolve(projectName);

        if (fs.existsSync(projectName)) {
            fs.removeSync(projectName);
        }

        fs.mkdirSync(projectName);
        process.chdir(projectName);

        process.stdout.write("\n");
        process.stdout.write("Initializing '" + projectName + "' ");

        // Build the scaffolding

        executeCmd("mkdir src");
        executeCmd("mkdir src/controller");
        executeCmd("mkdir src/service");
        executeCmd("mkdir src/types");

        // Copy templates

        copyTemplate("tsconfig.json", projectPath);
        copyTemplate(".gitignore", projectPath);
        copyTemplate("index.ts", projectPath + "/src");
        copyTemplate("health-controller.ts", projectPath + "/src/controller");
        copyTemplate("health-service.ts", projectPath + "/src/service");
        copyTemplate("game-types.ts", projectPath + "/src/types");

        // Initialize the NPM Project

        executeCmd("npm init -y");

        // Dynamically add the "build" script to package.json

        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = fs.readJsonSync(packageJsonPath);

        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.build = "tsc";
        packageJson.scripts.start = "node --no-warnings src/index.ts";

        fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

        // Download dev dependencies

        executeCmd("npm install --save-dev typescript");
        executeCmd("npm install --save-dev @types/bcrypt");
        executeCmd("npm install --save-dev @types/express");
        executeCmd("npm install --save-dev @types/node");
        executeCmd("npm install --save-dev @types/xml2js");
        executeCmd("npm install --save-dev body-parser");
        executeCmd("npm install --save-dev chai");
        executeCmd("npm install --save-dev express");
        executeCmd("npm install --save-dev mocha");
        executeCmd("npm install --save-dev nyc");
        executeCmd("npm install --save-dev sinon");

        executeCmd("npm install /Users/ivan/Development/Sandbox/crayfish-js/dist/framework");

        executeCmd(`npm run build`);

        console.log("\n\nDone!\n");

    } catch (error) {

        console.error("Failed to initialize project:", error);
    }
}

export async function buildCommand(environment: string) {

    console.log(`Building ... ${environment}`);

    // Logic to build project

    executeCmd(`npm run build`);
}

export async function generateCommand(type: string, name: string) {

    console.log(`Generating ${type}: ${name}`);

    // Logic to generate files or code snippets
}

export async function startServerCommand(environment: string) {

    // Logic to start a project

    try {

        process.stdout.write("\n");
        process.stdout.write("Starting the project ENV = '" + environment + "' ");

        // Run the execution

        process.stdout.write("\n");

        executeCmd(`npm run start`, false);

    } catch (error) {

        console.error("Failed to start project:", error);
    }
}