#!/usr/bin/env node
import { program } from 'commander'
import { downloadFromGit } from '../src/utils/download.js'
import chalk from 'chalk'
import figlet from 'figlet'
import { require } from '../src/utils/node.js'
import path from 'path'

const { version } = require(path.resolve(process.cwd(), 'package.json'))

program
  .command('create <projectName>')
  .description('init koa template')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action(async (name, options) => {
    await downloadFromGit(name, options)
  })

program.version(version).usage('<command> [option]')
program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('dlkoa', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }))
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan('dlkoa <command> --help')} show details\r\n`)
  })
program.parse()
