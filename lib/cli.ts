import Commander from 'commander';
import * as Actions from './actions';

/**
 * Main entrypoint
 */
async function main() {
    Commander.program
        .version('v1.0.0')
        .command('generate')
        .option('-i, --input <director>', 'Input directory')
        .option('-o, --output <director>', 'Output directory')
        .action(async (cmd: any) => {
            await Actions.Generate(cmd.input, cmd.output);
        });

    Commander.program
        .command('serve')
        .option('-p, --path <value>',
            'Path to the generated site directory')
        .option('-P, --port <value>',
            'Port to listen to', '3000')
        .action(async (cmd: any) => {
            await Actions.Serve(cmd.path, parseInt(cmd.port, 10) || 3000);
        });

    await Commander.program.parseAsync(process.argv);
}

main().then(() => {}).catch((err: any) => console.error(err));
