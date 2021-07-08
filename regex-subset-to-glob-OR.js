/*
regex-subset-to-glob supports:
	.* to *
	.  to ?
	[abc] and [a-z] (.* / . in brackets won't be touched)

Additionally, regex-subset-to-glob-OR (this script) supports regex OR
by splitting the patterns into different strings:
	"a|b|c" to ["a", "b", "c"]

But, "a|b|c" to Extended globbing "@(a|b|c)" is not supported.
*/

// getSegmentedPatterns(regexStr: String): [pattern: [sigment: String, ...], ...]
const getSegmentedPatterns = regexStr => {

	const chars = regexStr.split("");

	// patterns
	const patterns = [];
	const newPattern = () => patterns.push([]);

	//.sigment
	let needStartSigment = true;
	const last = arr => arr[arr.length - 1];
	function startSegment(char) {
		if (patterns.length === 0) {
			newPattern();
		}
		last(patterns).push(char);
		needStartSigment = false;
	}
	function appendChar(char) { // to the last segment
		const lastPattern = last(patterns);
		lastPattern[lastPattern.length - 1] += char;
	}
	function endSegment(char) {
		appendChar(char);
		needStartSigment = true;
	}

	let bracketOpenAt = -1;
	let i = 0;
	for (; i < chars.length; i++) {
		const char = chars[i];
		switch (char) {

			case "|":
				if (bracketOpenAt === -1) {
					newPattern();
				}
				break;

			case "[":
				if (bracketOpenAt !== -1) { // in brackets
					throw "missing ] at " + (i).toString();
				} else {
					bracketOpenAt = i;
					startSegment("[");
				}
				break;

			case "]":
				if (bracketOpenAt === -1) { // not in brackets
					throw "missing [ at " + (i).toString();
				} else if (bracketOpenAt === (i - 1)) {
					throw "empty bracket at " + (i - 1).toString();
				} else {
					bracketOpenAt = -1;
					endSegment("]");
				}
				break;

			default:
				if (needStartSigment === true) {
					startSegment(char);
				} else {
					appendChar(char);
				}
				break;
		}
	}

	if (bracketOpenAt !== -1) {
		throw "missing ] at " + (i).toString() + " (the end)";
	}

	return patterns;
};

// replaceWildcards(sigment: String): String
const replaceWildcards = segment =>
	segment.startsWith("[")
		? segment
		: segment.replaceAll(".*", "*").replaceAll(".", "?");


// regexSubsetToGlobOR(regexStr: String): [pattern: String, ...]
function regexSubsetToGlobOR(regexStr) {

	const patterns = getSegmentedPatterns(regexStr).map(
		pattern => pattern.map(replaceWildcards).join("")
	);

	// Always return an array of glob pattern strings
	return patterns;

	/*
	// Return a glob pattern string when there is only 1 pattern
	return patterns.length === 1 ? patterns[0] : patterns;
	*/

}

export default regexSubsetToGlobOR;
