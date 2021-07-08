import regexSubsetToGlob   from "./regex-subset-to-glob.js";
import regexSubsetToGlobOR from "./regex-subset-to-glob-OR.js";

// for quickjs
if ( ("log" in console) && !("error" in console) ) console.error = console.log;

const inputs = ["a[bc][d]e[fg-w]x.y.*z", "[a|b]c|d[e]||f", "[", "]", "[]"];

const testInput = func => input => {
	try {
		console.log(func(input));
	} catch (e) {
		console.error(e);
	}
};

console.log("inputs:", inputs);
console.log("");
console.log("regexSubsetToGlob:");
inputs.forEach(testInput(regexSubsetToGlob));
console.log("");
console.log("regexSubsetToGlobOR:");
inputs.forEach(testInput(regexSubsetToGlobOR));

/*

*/
