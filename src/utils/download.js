import path from 'path'
import fs from 'fs'
import ora from 'ora'
import chalk from 'chalk'
import inquirer from 'inquirer'
import downloadGitRepo from 'download-git-repo'
import childProcess from 'child_process'
import { GIT_REPO } from '../constants/constant.js'

const downloadFromGit = async (name, { force }) => {
  const spinner = ora('downloading...')
  //   spinner.start();
  const cwd = process.cwd()
  const targetFolder = path.join(cwd, name)

  const download = async () => {
    spinner.start()
    downloadGitRepo(GIT_REPO, targetFolder, {
      clone: true
    }, function (err) {
      if (err) {
        console.log(err)
        spinner.fail(chalk.red('download error!'))
      } else {
        spinner.succeed('download success')
        installDependent(targetFolder)
      }
    })
  }
  if (fs.existsSync(targetFolder)) {
    // 目录存在
    if (force) {
      await fs.rmSync(targetFolder, { recursive: true })
      await download()
    } else {
      const { overWrite } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overWrite',
        message: 'target folder is already exist, overWrite?'
      }])
      if (overWrite) {
        await fs.rmSync(targetFolder, { recursive: true })
        await download()
      } else {
        console.error(chalk.red('target folder is not empty'))
      }
    }
  } else {
    // 目录不存在
    await download()
  }
}

const installDependent = async (dir) => {
  const spinner = ora('installing dependent...')
  spinner.start()
  try {
    await childProcess.execSync(`cd ${dir} && npm i`, {
      cwd: dir
    })
    spinner.succeed('install dependent success!')
    spinner.succeed('create success!')
  } catch (e) {
    spinner.fail(chalk.red('install dependent error!'))
  }
}
export { downloadFromGit }
