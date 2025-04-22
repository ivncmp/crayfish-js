/**
 * Development Server
 */

import express, { Request, Response } from 'express';
import { handleRequest } from '../framework';
import chalk from 'chalk';

/**
 * processHTTP
 */
async function processHTTP(res: any, data: any) {

    // Favicon

    if (data.path == "/favicon.ico") {
        res.status(200);
        res.end(JSON.stringify({}, null, 3));
        return;
    }

    // API Call

    try {

        const response = await handleRequest(data);

        if (!response) {

            res.setHeader('Content-Type', 'application/json');
            res.status(500);
            res.end(JSON.stringify({ e: "UNKNONW" }, null, 3));

            return;
        }

        const responseHeaders = (response.headers as any);

        Object.keys(response.headers).forEach(function (key) {
            res.setHeader(key, responseHeaders[key]);
        });

        res.status(response.statusCode);

        if (responseHeaders["Content-Type"] == "application/json") {
            res.end(JSON.stringify(JSON.parse(response.body), null, 3));
        } else {
            res.end(response.body);
        }

    } catch (e: any) {

        console.warn("Service Error: " + data.path);
        console.warn(e.stack)

        res.setHeader('Content-Type', 'application/json');
        res.status(500);
        res.end(JSON.stringify({ e: e, stack: e.stack }, null, 3));
    }
}

/**
 * startDevServer
 */
export async function startDevServer() {

    const app = express();
    const port = 3030;

    app.use(express.json({ limit: '50mb' }))
    app.use(express.raw({ limit: '50mb', type: () => true }));

    app.all('*', (req: Request, res: Response) => {

        const contentType = req.headers["content-type"];
        const body = contentType == "application/xml" ?
            req.body.toString() : JSON.stringify(req.body);

        processHTTP(res, {
            body: body,
            path: req.url,
            httpMethod: req.method,
            queryStringParameters: req.query,
            headers: req.headers,
            local: true
        });
    });

    app.listen(port, () => {

        console.log(chalk.greenBright(`Started at http://localhost:${port}\n`));
    });
}