#! /usr/bin/env node

import fs from 'fs';
import path from 'path';
import git from 'simple-git';
import { execSync } from 'child_process';

const args = process.argv.slice(2, process.argv.length);

if(args.length === 0) {
	console.error("Application name required")
} else {
	const name = args[0]
	try {
		await git().silent(false).clone("https://github.com/thoughtsunificator/domodel-skeleton", name)
		const projectPath = path.resolve(process.cwd(), name)
		const packagePath = path.resolve(projectPath, 'package.json')
		const data = fs.readFileSync(packagePath)
		let { devDependencies, dependencies, scripts, type } = JSON.parse(data);
		fs.rmSync(path.resolve(projectPath, ".git"), { recursive: true })
		fs.writeFileSync(packagePath, JSON.stringify({ name, type, devDependencies, dependencies, scripts }, null, "\t"));
		execSync(`cd ${projectPath} && npm install`, {stdio: 'inherit'})
		console.log("\n\u001b[32mYour domodel application is now ready. Happy codding!\u001b[0m")
	} catch(ex) {
		console.error('failed: ', ex)
	}
}
