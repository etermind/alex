import Finalhandler from 'finalhandler';
import Http from 'http';
import ServeStatic from 'serve-static';

/**
 * Serve for testing purpose
 * @param path The path to be served
 * @param port The port to listen to
 */
export default async function serve(path: string, port: number = 3000, root: string = '') {
    const escapedRoot = root.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Serve up public/ftp folder
    const serve = ServeStatic(path, { index: ['index.html', 'index.htm'] });

    // Create server
    const server = Http.createServer((req: any, res: any) => {
        req.url = req.url.replace(new RegExp(escapedRoot, 'gi'), '');
        if (req.url === '') {
            req.url = '/';
        }

        serve(req, res, Finalhandler(req, res));
    });

    // Listen
    server.listen(port);
    console.log(`Please browse to http://localhost:${port}${root} to visualize your website`);
}
