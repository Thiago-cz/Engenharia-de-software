/* eslint-disable quotes */
export const test = {
	"testEnvironment": "node",
	"testMatch": [ "tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ],
	"testPathIgnorePatterns": ["/node_modules/"],
	transform: {
		"^.+\\.[t|j]sx?$": "babel-jest"
	}
};

export default test;