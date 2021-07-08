/*
regex-subset-to-glob (this script) supports:
	.* to *
	.  to ?
	[abc] and [a-z] (.* / . in brackets won't be touched)
*/

// getSegments(regexStr: String): [sigment: String, ...]
const getSegments = regexStr => {

	const chars = regexStr.split("");

	const segments = [];
	let newSigment = true;
	function startSegment(char) {
		segments.push(char);
		newSigment = false;
	}
	function appendChar(char) { // to the last sigment
		segments[segments.length - 1] += char;
	}
	function endSegment(char) {
		appendChar(char);
		newSigment = true;
	}

	let bracketOpenAt = -1;
	let i = 0;
	for (; i < chars.length; i++) {
		const char = chars[i];
		switch (char) {

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
				if (newSigment === true) {
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

	return segments;
};

// replaceWildcards(sigment: String): String
const replaceWildcards = segment =>
	segment.startsWith("[")
		? segment
		: segment.replaceAll(".*", "*").replaceAll(".", "?");

// regexSubsetToGlob(regexStr: String): String
const regexSubsetToGlob = (regexStr) =>
	getSegments(regexStr).map(replaceWildcards).join("");

export default regexSubsetToGlob;
