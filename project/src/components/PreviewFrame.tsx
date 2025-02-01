import { WebContainer } from '@webcontainer/api';
import React, { useState, useEffect } from 'react';
import { FileItem } from '../types';

interface PreviewFrameProps {
    files: FileItem[];
    webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
    const [url, setUrl] = useState<string>("");

    async function main() {
        try {
            // Installing dependencies
            const installProcess = await webContainer.spawn('npm', ['install']);
            installProcess.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));

            // Running the development server
            await webContainer.spawn('npm', ['run', 'dev']);

            // Waiting for `server-ready` event
            webContainer.on('server-ready', (port, url) => {
                console.log(`Server ready at: ${url}`);
                setUrl(url);
            });
        } catch (error) {
            console.error('Error in WebContainer setup:', error);
        }
    }

    useEffect(() => {
        main();
    }, [webContainer]);

    return (
        <div className="h-full flex items-center justify-center text-gray-400">
            {!url && <div className="text-center">
                <p className="mb-2">Loading development server...</p>
            </div>}
            {url && <iframe width="100%" height="100%" src={url} title="Preview" />}
        </div>
    );
}