#! /usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import git from 'simple-git';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2, process.argv.length);

if(args.length === 0) {
	console.error("Application name required")
} else {
	const name = args[0]
	try {
		await git().silent(false)	.clone("https://github.com/thoughtsunificator/domodel-skeleton", name)
		const packagePath = path.resolve(__dirname, name, 'package.json')
		const data = fs.readFileSync(packagePath)
		let { devDependencies, dependencies, scripts } = JSON.parse(data);
		fs.writeFileSync(packagePath, JSON.stringify({ name, devDependencies, dependencies, scripts }, null, "\t"));
		execSync(`npm --prefix ./${name} install ./${name}`, {stdio: 'inherit'})
	} catch(ex) {
		console.error('failed: ', ex)
	}
}
