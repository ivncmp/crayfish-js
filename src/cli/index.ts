import { program } from 'commander';
import { initCommand, buildCommand, startServerCommand } from './commands';

program
    .version('1.0.0')
    .description('My Backend Framework CLI');

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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}