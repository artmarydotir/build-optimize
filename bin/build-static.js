#!/usr/bin/env node

const program = require('commander'); // eslint-disable-line import/no-extraneous-dependencies
const ora = require('ora'); // eslint-disable-line import/no-extraneous-dependencies

const generateIcons = require('./scripts/generate-icons');

program
  .command('build-all')
  .action(async () => {
    const spinner = ora({
      spinner: 'hearts',
      text: 'Generating...',
    }).start();

    await generateIcons();

    spinner.succeed('Done');
  });

program.parse(process.argv);
