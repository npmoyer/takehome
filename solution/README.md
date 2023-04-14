# Serif Health Takehome Interview

## Environment Setup

- Install [node.js and npm](https://nodejs.org/en/download)

## Instructions

- Open the `solution` dir
- Run `npm run build` to compile the TypeScript
- Run `npm run pipeline` to run the data pipeline

### Output

- The generated list of URLs is located at `solution/output.txt`

## Details

- Time to write: ~2 hours
- Time to run (excluding file download):57 min

### Implementation

This code processes the file by utilizing the node zlib package. The file is too large to unzip so it must be processed as it is read from a file stream. This is done by creating a read stream and a listener for the `data` event during the unzip process. This buffer is converted to a string so that the JSON can be parsed. There is some manual concatenation and splitting done in order to get a valid list of "in_network_files". Once there is valid JSON, it is filtered to that it only includes the NY PPO URLS.

### Tradeoffs

If I had more time I would have done the following:

- Make the algorithm more robust. There are some issues with invalid JSON that causes some of the data to be missed.
- Included unit tests that utilize mock data
- Handle duplicate URLs in the output file
- Parallelize the pipeline to reduce runtime
