import chalk from "chalk";
import { execSync } from "child_process";

import * as fs from "fs-extra";
import * as path from 'path';

function toPascalCase(str: string): string {

    return str
        .replace(/[-_]+/g, ' ')
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) { return $1.toUpperCase(); });
}

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

        const cray = "" +
            "         @@@@%                +******************        *****       \n" +
            "             %@@@@%        ***********************************       \n" +
            "                 %@@@%@ +*#%#*****************#***#**********        \n" +
            "                      #******++++*******************************     \n" +
            "                    ++++++++++++++++++++++++++*++++*++*+++++++++     \n" +
            "                    %@%*==+#+=======++++++++++*++++*+++==*++++++     \n" +
            "                @@@@@    =*#+=====++++++++++++*+++*++++++++++        \n" +
            "           @@@@@@           ====++++++++++++++++++++++ +++++++       \n" +
            "       %@@@@@                 ======+   +++  ++          +++++       \n\n";

        process.stdout.write("\n");
        process.stdout.write("\n");

        process.stdout.write(chalk.red(cray));
        process.stdout.write(chalk.green("Initializing '" + projectName + "' "));

        // Build the scaffolding

        executeCmd("mkdir src");
        executeCmd("mkdir src/controller");
        executeCmd("mkdir src/service");
        executeCmd("mkdir src/environment");
        executeCmd("mkdir src/types");

        // Copy templates

        copyTemplate("tsconfig.json", projectPath);
        copyTemplate(".gitignore", projectPath);
        copyTemplate("index.ts", projectPath + "/src");
        copyTemplate("health-controller.ts", projectPath + "/src/controller");
        copyTemplate("health-service.ts", projectPath + "/src/service");
        copyTemplate("project-types.ts", projectPath + "/src/types");
        copyTemplate("prod.ts", projectPath + "/src/environment");

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

        executeCmd(`npm run build`);

        console.log("\n\nDone!\n");

    } catch (error) {

        console.error("Failed to initialize project:", error);
    }
}

export async function buildCommand(environment: string) {

    console.log(`Building ... ${environment}`);

    // Logic to build project

    executeCmd(`npm run build`, false);
}

export async function generateController(controllerName: string) {

    // Logic to generate generateController or code snippets

    try {

        process.stdout.write("\n");
        process.stdout.write("Creating '" + controllerName + "' ");

        const controllerFile = "src/controller/" + controllerName + "-controller.ts";

        // Copy templates

        copyTemplate("simple-controller.ts", "src/controller");

        executeCmd("mv src/controller/simple-controller.ts " + controllerFile);

        let fileContent = await fs.readFile(controllerFile, 'utf8');

        const replacements = {
            controllerName: controllerName,
            controllerClass: toPascalCase(controllerName) + 'Controller',
            controllerMethod: 'get' + toPascalCase(controllerName)
        };

        for (const [variable, value] of Object.entries(replacements)) {
            const regex = new RegExp(`\\$\\{${variable}\\}`, 'g');
            fileContent = fileContent.replace(regex, value);
        }

        await fs.writeFile(controllerFile, fileContent, 'utf8');

        executeCmd(`npm run build`);

        console.log("\n\nDone!\n");

    } catch (error) {

        console.error("Failed to generate:", error);
    }
}

export async function generateService(serviceName: string) {

    // Logic to generate generateController or code snippets

    try {

        process.stdout.write("\n");
        process.stdout.write("Creating '" + serviceName + "' ");

        const serviceFile = "src/service/" + serviceName + "-service.ts";

        // Copy templates

        copyTemplate("simple-service.ts", "src/service");

        executeCmd("mv src/service/simple-service.ts " + serviceFile);

        let fileContent = await fs.readFile(serviceFile, 'utf8');

        const replacements = {
            serviceClass: toPascalCase(serviceName) + 'Service'
        };

        for (const [variable, value] of Object.entries(replacements)) {
            const regex = new RegExp(`\\$\\{${variable}\\}`, 'g');
            fileContent = fileContent.replace(regex, value);
        }

        await fs.writeFile(serviceFile, fileContent, 'utf8');

        executeCmd(`npm run build`);

        console.log("\n\nDone!\n");

    } catch (error) {

        console.error("Failed to generate:", error);
    }
}

export async function startServerCommand(environment: string) {

    // Logic to start a project

    try {

        process.stdout.write("\n");
        process.stdout.write("Starting the project ENV = '" + environment + "' ");

        // Run the execution

        process.stdout.write("\n");
        process.env.ENVIRONMENT = environment || "prod";

        executeCmd("npm run build", false);
        executeCmd("npm run start", false);

    } catch (error) {

        console.error("Failed to start project:", error);
    }
}