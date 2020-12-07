#! /usr/bin/env node

import Commander from 'commander';
import * as Actions from './actions';

/**
 * Main entrypoint
 */
async function main() {
    Commander.program
        .version('v1.0.0')
        .command('generate')
        .requiredOption('-i, --input <directory>', 'Input directory')
        .requiredOption('-o, --output <directory>', 'Output directory')
        .action(async (cmd: any) => {
            console.log(`Generate your website from ${cmd.input}, please wait...`);
            await Actions.Generate(cmd.input, cmd.output);
            console.log(`Website successfully generated in ${cmd.output}`);
        });

    Commander.program
        .command('serve')
        .requiredOption('-p, --path <value>',
            'Path to the generated site directory')
        .requiredOption('-P, --port <value>',
            'Port to listen to', '3000')
        .option('-r, --root <value>',
            'Root of the URL (should be config.rootPath in your config.yml)')
        .action(async (cmd: any) => {
            const port = parseInt(cmd.port, 10) || 3000;
            await Actions.Serve(cmd.path, port, cmd.root);
        });

    Commander.program
        .command('init')
        .requiredOption('-t, --theme <directory>',
            'Path to the theme directory (a directory with a config.default.yml file and a theme subdirectory)')
        .requiredOption('-o, --output <directory>', 'Output directory')
        .action(async (cmd: any) => {
            await Actions.Init(cmd.theme, cmd.output);
        });

    await Commander.program.parseAsync(process.argv);
}

main().then(() => {}).catch((err: any) => console.error(err));
