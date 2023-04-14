import fs from 'fs';
import https from 'https';
import {createGunzip} from 'zlib';


const ZIP_FILE_NAME = '2023-04-01_anthem_index.json.gz';
const OUTPUT_FILE_NAME = 'output.txt';
const URL = 'https://antm-pt-prod-dataz-nogbd-nophi-us-east1.s3.amazonaws.com/anthem/2023-04-01_anthem_index.json.gz';

async function downloadFile() {
    if (!fs.existsSync(ZIP_FILE_NAME)) {
        const file = fs.createWriteStream(ZIP_FILE_NAME);
        https.get(URL, response => {
            console.log('Downloading File...')
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log('Download Completed!');
            });
        })
    }
}

async function main() {
    await downloadFile();

    const gunzip = createGunzip();
    let prev = '';

    fs.createReadStream(ZIP_FILE_NAME)
    .pipe(gunzip)
    .on('data', data => {
        const dataStr = prev + data.toString();
        let dataJSON = undefined;
        const dataInNet: string = dataStr.substring(dataStr.indexOf('"in_network_files":') + 19);

        if (dataInNet.includes('}]')) {
            try {
                dataJSON = JSON.parse(dataInNet.substring(0, dataInNet.indexOf('}]') + 2));
            } catch (err) {
                console.log(err);
            }
            prev = '';
        } else {
            prev = '"in_network_files":' + dataInNet;
        }

        if (dataJSON) {
            dataJSON.forEach(element => {
                const loc = element.location;
                if (loc && loc.includes('NY_BCC')) {
                    console.log('Writing to file')
                    fs.appendFile(OUTPUT_FILE_NAME, loc + '\n', err => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    })
}

main().catch((error) => {
    process.exitCode = 1;
    throw error;
});
