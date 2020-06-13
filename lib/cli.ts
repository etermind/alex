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

    /* Commander.program
        .command('email-templates')
        .option('-t, --templates <value>',
            'Name of the template to create (can be repeated for multiple templates)',
            collect, [])
        .option('-f, --file <value>',
            'Path to the HTML template')
        .action(async (cmd: any) => {
            console.log(`Generating email templates: ${cmd.templates}`);
            await generateEmailTemplates(cmd.templates, cmd.file);
        });
    */

    await Commander.program.parseAsync(process.argv);
}

main().then(() => {}).catch((err: any) => console.error(err));
