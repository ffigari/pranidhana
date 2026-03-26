import simpleGit from 'simple-git';

const sg = simpleGit();

export const git = new (class {
	async revParse(target: string): Promise<string> {
		const result = await sg.raw(['rev-parse', target]);
		return result.trim();
	}
})
