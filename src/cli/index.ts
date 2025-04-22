import { program } from 'commander';
import {
    initCommand, buildCommand, startServerCommand,
    generateController, generateService
} from './commands';

program
    .version('1.0.0')
    .description('Crayfish-JS Backend Interface.');

program
    .command('init <projectName>')
    .alias('i')
    .description('Initialize a new project')
    .action(initCommand);

program
    .command('build <environment>')
    .alias('b')
    .description('Build the project')
    .action(buildCommand);

program
    .command('start-server <environment>')
    .alias('s')
    .description('Starts the development server')
    .action(startServerCommand);

program
    .command('generate-controller <controller>')
    .alias('gc')
    .description('Generates a new Controller')
    .action(generateController);

program
    .command('generate-service <service>')
    .alias('gs')
    .description('Generates a new Service')
    .action(generateService);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}