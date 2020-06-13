import Finalhandler from 'finalhandler';
import Http from 'http';
import ServeStatic from 'serve-static';

/**
 * Serve for testing purpose
 * @param path The path to be served
 * @param port The port to listen to
 */
export default async function serve(path: string, port: number = 3000) {
    // Serve up public/ftp folder
    const serve = ServeStatic(path, { index: ['index.html', 'index.htm'] });

    // Create server
    const server = Http.createServer((req: any, res: any) => {
        serve(req, res, Finalhandler(req, res));
    });

    // Listen
    server.listen(port);
    console.log(`Please browse to http://localhost:${port} to visualize your website`);
}
